import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";

interface SalesCyclesProps {
    value: string;
    onChange: (value: string) => void;
}
export default function SalesCycles({value, onChange}: SalesCyclesProps ) {
    const [salesCycles, setSalesCycles] = useState<any[]>([]);
    // const [selectedCycle, setSelectedCycle] = useState("");
    
    const fetchSales = async () => {
        const baseUrl = import.meta.env.VITE_API_URL;

        try {
            const res = await axios.get(`${baseUrl}/sap-sales-cycles`);
            setSalesCycles(res.data);
        } catch (error: any) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const optionsCycle = [
        { value: "", label: "Select Sales Cycle" },
        ...salesCycles.filter((cycle) => cycle.isActive == true)
        .map((cycle) => ({
            value: cycle.code,
            label: cycle.description
        }))
    ];


    return (
        <>
            < Select
                options={optionsCycle}
                value={value ? optionsCycle.find(o => o.value === value) ?? null : null}
                onChange={(option) => onChange(option?.value || '')}
                isSearchable={true}
                placeholder="Select Sales Cycle"
            />

        </>
    )
}
