import { Listbox, Menu, Transition } from "@headlessui/react"
import { ChartBarIcon } from "@heroicons/react/outline"
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid"
import { Portfolio, User } from "@prisma/client"
import classNames from "classnames"
import { FC, Fragment } from "react"
import { Link, useNavigate } from "remix"

export interface NavbarProps {
    readonly user?: User
    readonly currentPortfolio?: Portfolio
    readonly onPortfolioChange: (p: Portfolio | undefined) => void
    readonly portfolios?: Portfolio[]
}

export const Navbar: FC<NavbarProps> = ({ user, currentPortfolio, onPortfolioChange, portfolios }) => {
    const navigate = useNavigate()

    const handlePortfolioChange = (p: Portfolio) => {
        onPortfolioChange(p)
        navigate("/dashboard")
    }

    return (
        <nav>
            <div className="relative flex items-center justify-between h-16">
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                    {user && currentPortfolio &&
                        <Link to="/dashboard" className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium flex flex-row items-center gap-2">
                            <ChartBarIcon className="h-5 w-5" />
                            Dashboard
                        </Link>
                    }
                    {/* <div className="flex space-x-4">
                        {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className={`${item.current ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'} px-3 py-2 rounded-md text-sm font-medium`}
                            aria-current={item.current ? 'page' : undefined}
                        >
                            {item.name}
                        </a>
                        ))}
                    </div> */}
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    {user && (<Link to="/portfolio/new/name" className={"p-2 px-3 bg-gray-800 rounded-md text-sm text-white mr-2 font-medium"}>
                        Criar novo portfolio
                    </Link>)}
                    {currentPortfolio ?
                        (
                            <div className="w-52">
                            <Listbox value={currentPortfolio.id} onChange={id => {
                                const portfolio = portfolios?.find(p => p.id === id)
                                portfolio && handlePortfolioChange(portfolio)
                            }}>
                                <div className="relative">
                                    <Listbox.Button className={classNames("relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm")}>
                                        <span className="block truncate">{currentPortfolio.name}</span>
                                        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </span>
                                    </Listbox.Button>
                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {portfolios?.map((portfolio) => (
                                                <Listbox.Option
                                                    key={portfolio.id}
                                                    value={portfolio.id}
                                                    className={({ active }) =>
                                                        `cursor-default select-none relative py-2 pl-10 pr-4 ${
                                                        active ? 'text-white bg-indigo-600' : 'text-gray-900'}
                                                        `
                                                    }
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <span
                                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                {portfolio.name}
                                                            </span>
                                                            {selected ? (
                                                                <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white" : "text-indigo-600"}`}>
                                                                    <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                                ))
                                            }
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                            </div>
                        ) : null}

                    {/* Profile dropdown */}
                    {user ? (<Menu as="div" className="ml-3 relative">
                        <div>
                            <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white items-center">
                                <img
                                    className="h-8 w-8 rounded-full"
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt=""
                                />
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <Menu.Item>
                                    {({ active }) => (
                                    <Link to="#" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                                        Your Profile
                                    </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                    <Link to="#" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                                        Settings
                                    </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                    <Link to="/logout" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                                        Sign out
                                    </Link>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </Menu>) : (
                        <div className="flex flex-row gap-2">
                            <Link to="/login" className="px-4 py-2 text-white bg-gray-900 rounded-md font-medium">Login</Link>
                            <Link to="/join" className="px-4 py-2 text-gray-700 rounded-md border border-gray-300 font-medium">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}