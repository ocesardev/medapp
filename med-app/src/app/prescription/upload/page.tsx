"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link";

export default function PrescriptionCreate() {

    const router = useRouter();

    useEffect(() => {

        fetch('http://127.0.0.1:3001/prescriptions', {

            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("token") || ''
            }
        }).then(response => response.json())
            .then(
                data => {
                    setPrescriptions(Array.isArray(data) ? data : data.prescriptions || []);
                }
            );
    }, []);

    const [file, setFile] = useState<Blob>();
    const [error, setError] = useState<string | unknown>('');

    const [prescriptions, setPrescriptions] = useState(new Array());

    const uploadPrescription = async (id: any) => {
        try {
            if (!file) {
                setError("Nenhum arquivo selecionado");
                return;
            }

            const formData = new FormData();
            formData.append('file', file, (file as File).name);

            const res = await fetch('http://127.0.0.1:3001/uploadPrescription/' + id, {
                method: 'POST',
                headers: {
                    'Authorization': sessionStorage.getItem("token") || ''
                },
                body: formData
            });

            router.push('/prescription/upload');
            // handle the error
            if (!res.ok)
                throw new Error(await res.text());
        } catch (error) {
            setError(error);
        }
    };

    const showFile = async (id: any) => {
        try {

            const res = await fetch('http://127.0.0.1:3001/readPrescription/' + id, {
                method: 'GET',
                headers: {
                    'Authorization': sessionStorage.getItem("token") || ''
                },
            });

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = id + ".pdf";
            link.click();

            // handle the error
            if (!res.ok)
                throw new Error(await res.text());
        } catch (error) {
            setError(error);
        }
    };

    const generatePrescription = async (id: any) => {
        try {

            const res = await fetch('http://127.0.0.1:3001/generatePrescription/' + id, {
                method: 'GET',
                headers: {
                    'Authorization': sessionStorage.getItem("token") || ''
                },
            });

            // handle the error
            if (!res.ok)
                throw new Error(await res.text());

            const content = await res.json();

            if (content._id) {
                window.location.reload();
            } else {
                setError(content.error);
            }
        } catch (error) {
            setError(error);
        }
    }

    return (
        <>
            <Link
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
                href="/home"
            >
                Voltar
            </Link>

            <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="min-w-full border border-slate-300 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                <thead className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                    <tr>
                    <th className="border border-slate-300 px-4 py-2 text-left">Data</th>
                    <th className="border border-slate-300 px-4 py-2 text-center">Medicine</th>
                    <th className="border border-slate-300 px-4 py-2 text-center">Dosage</th>
                    <th className="border border-slate-300 px-4 py-2 text-center">Instructions</th>
                    <th className="border border-slate-300 px-4 py-2 text-center" colSpan={3}>
                        Ações
                    </th>
                    </tr>
                </thead>

                <tbody className="doctors" id="doctors">
                    {!!prescriptions &&
                    prescriptions.map((prescription: any) => (
                        <tr
                        key={prescription._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                        >
                        <td className="border border-slate-300 px-4 py-2">
                            {prescription.date}
                        </td>
                        <td className="border border-slate-300 px-4 py-2 text-center">
                            {prescription.medicine}
                        </td>
                        <td className="border border-slate-300 px-4 py-2 text-center">
                            {prescription.dosage}
                        </td>
                        <td className="border border-slate-300 px-4 py-2 text-center">
                            {prescription.instructions}
                        </td>

                        {!prescription.file && (
                            <>
                            <td className="border border-slate-300 px-4 py-2 text-center">
                                <input
                                    type="file"
                                    name="file"
                                    className="
                                    text-sm 
                                    w-full
                                    cursor-pointer
                                    file:mr-3 
                                    file:py-1 
                                    file:px-3 
                                    file:rounded-lg 
                                    file:border-0 
                                    file:bg-blue-600 
                                    file:text-white 
                                    hover:file:bg-blue-700
                                    "
                                    onChange={(e) => setFile(e.target.files?.[0])}
                                />
                            </td>
                            <td className="border border-slate-300 px-4 py-2 text-center">
                                <button
                                    onClick={() => uploadPrescription(prescription._id)}
                                    className="bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg text-white text-sm shadow-sm cursor-pointer"
                                >
                                    Upload
                                </button>
                            </td>
                            <td className="border border-slate-300 px-4 py-2 text-center">
                                <button
                                    onClick={() => generatePrescription(prescription._id)}
                                    className="bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg text-white text-sm shadow-sm cursor-pointer"
                                >
                                    Gerar Prescrição
                                </button>
                            </td>
                            </>
                        )}

                        {prescription.file && (
                            <td
                            colSpan={3}
                            className="border border-slate-300 px-4 py-2 text-center"
                            >
                            <button
                                onClick={() => showFile(prescription._id)}
                                className="bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg text-white text-sm shadow-sm cursor-pointer"
                            >
                                Ver Arquivo
                            </button>
                            </td>
                        )}
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </>


    )
}