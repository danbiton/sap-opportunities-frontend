import axios from "axios"
import { useEffect, useState } from "react";
import Select from "react-select"

interface SalesPhaseProps {
    value: string,
    onChange: (value: string) => void,
    selectedCycleCode?: string
}
export default function SalesPhase({ value, onChange, selectedCycleCode }: SalesPhaseProps) {
    const [salesPhase, setSalesPhase] = useState<any[]>([]);
    // const [selectedPhase, setSelectedPhase] = useState('')

    const fetchPhase = async () => {
        const baseUrl = import.meta.env.VITE_API_URL
        try {
            const res = await axios.get(`${baseUrl}/sap-sales-cycles`)
            console.log("response:", res.data)
            const activeCycles = res.data.filter((cycle: any) => cycle.isActive === true);
            console.log('activeCycles :', activeCycles)

            const allPhases
                = activeCycles.flatMap((cycle: any) =>
                    cycle.salesPhases.map((phase: any) => ({
                        ...phase,
                        cycleCode: cycle.code
                    }))
                );

            console.log('allPhases:', allPhases)
            setSalesPhase(allPhases)
        }
        catch (error: any) {
            console.error("Error:", error);
        }


    }
    useEffect(() => {
        fetchPhase()

    }, [])
    const filteredPhases = selectedCycleCode
        ? salesPhase.filter(phase => phase.cycleCode === selectedCycleCode)
        : Array.from(
            new Map(salesPhase.map(phase => [phase.code, phase])).values()
        )
    const phaseOptions = [{ value: "", label: "Select Sales Phase" }, ...filteredPhases
        .map((phase) => ({
            value: phase.code,
            label: phase.description
        }))]


    return (


        <>
            <Select
                options={phaseOptions}
                value={value ? phaseOptions.find(v => v.value === value) ?? null : null}
                onChange={(option) => onChange(option?.value || '')}
                isSearchable={true}
                placeholder='Select Sales Phase'
            />
        </>
    )
}
