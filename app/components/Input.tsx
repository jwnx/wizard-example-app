import classNames from "classnames";
import React from "react";
import { FC } from "react";

export interface InputProps {
    readonly name: string
    readonly label: string
    readonly defaultValue?: string
    readonly component?: "input" | "textarea"
    readonly required?: boolean
}

export const Input: FC<InputProps> = ({ name, label, defaultValue, component = "input", required }) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
                {React.createElement(component, {
                    type: "text",
                    name,
                    id: name,
                    className: classNames(component === "input" ? "h-10" : "pt-2", "focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 sm:text-sm border border-gray-300 rounded-md"),
                    defaultValue,
                    rows: 4,
                    required,
                })}
            </div>
        </div>
    )
}