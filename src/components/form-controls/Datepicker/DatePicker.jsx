import React, { useEffect, useState } from 'react'
import { convertDateToMiliseconds } from '../../../services/ApiService';

export const DatePicker = (props) => {
    const { form, name, label, type, disabled, children, defaultValue } = props;
    const [checkDefaultValue, setCheckDefault] = useState(true);
    const [error, setError] = useState('');

    const handleCheckTime = (event) => {
        let timeSet = event.target.value;
        let milisecondtTimeSet = convertDateToMiliseconds(timeSet.toString());
        let timeReal = new Date();
        timeReal = convertDateToMiliseconds(timeReal.toString());

        if (milisecondtTimeSet - timeReal < 0) {
            setError('Please choose a start date after the current date')
            console.error("ERRROR");
        } else
            setError('');
    }

    useEffect(() => {
        if (defaultValue === '') {
            form.setValue(name, '');
            setCheckDefault(false);
        } else {
            if (defaultValue) {
                form.setValue(name, defaultValue);
                setCheckDefault(false);
            }
        }

    }, [defaultValue])

    return (
        <>
            <div class="relative max-w-sm w-[0.75/2] m-auto">
                <label htmlFor={name} className="block text-sm  font-medium text-gray-700">{label}</label>
                <input
                    // 
                    {...form.register(name)}
                    {...defaultValue && checkDefaultValue === true && form.setValue(name, defaultValue)}
                    name={name}
                    datepicker
                    type="datetime-local"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
                    placeholder={`Select ${label}`}

                    onChange={(event) => handleCheckTime(event)}
                />
                {error && <label className=' text-[15px] text-red-600'>{error}</label>}
            </div>
        </>
    )
}
