import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";

interface StatusProps{
    value: string,
    onChange: (value: string) => void
}

export default function OpportunityStatus({value, onChange}: StatusProps) {
    const [status, setStatus] = useState<any[]>([]);
    // const [selectedStatus, setSelectedStatus] = useState('')

    const baseUrl = import.meta.env.VITE_API_URL

    const fetchStatus = async () => {
        try {
            const res = await axios.get(`${baseUrl}/sap-status`)
            console.log(res)
            console.log(res.data)
            setStatus(res.data)

        }
        catch (error: any) {
            console.log("error:", error)
        }

    }
    useEffect(() => {
        fetchStatus()

    }, [])

    const statusOptions = [{ value: '', label: 'Select Status' }, ...status.map((stat) =>
    ({
        value: stat.code,
        label: stat.description
    }))]

    return (
        <>
            <Select
                options={statusOptions}
                value={value ? statusOptions.find(o => o.value === value) : null}
                onChange={(option) => onChange(option?.value || '')}
                isSearchable={true}
                placeholder='Select Status'

            />
        </>

    )

}