import React from "react";
import Link from "next/link";

export default function Home(){
    return (
        <>
        <h1>Home</h1>
        <div>
            <Link href={"/doctor/create"}>Create a new doctor</Link>
            <br />
            <Link href={"/doctor/list"}>List all doctors</Link>
            <br />
            <Link href={"/pacient/create"}>Create a new pacient</Link>
            <br />
            <Link href={"/appointment/create"}>Create a new appointment</Link>
            <br />
            <Link href={"/prescription/create"}>Create a new prescription</Link>
        </div>
        </>
    );
}