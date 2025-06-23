"use client";
import React from "react";
import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    placeholder?: string;
    type?: "text" | "email" | "password" | "file" | "number";
}

/* Cannot find name 'T'.ts(2304)
 type T = unresolved any
 */
//Ans: ✅ Declare <T extends FieldValues> in the function itself
const FormField = <T extends FieldValues> ({ control, name, label, placeholder, type = "text" }: FormFieldProps<T>) => (
    <Controller
        control={control}
        name={name}
        render={({ field }) => ( //rendering form items
            <FormItem>
                <FormLabel className="label">{label}</FormLabel>
                <FormControl>
                    <Input
                        className="input"
                        placeholder={placeholder}
                        {...field}
                        type={type}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

export default FormField;
