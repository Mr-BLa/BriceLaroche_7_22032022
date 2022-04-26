/* 
*           MAIN
*/

import React from "react"

export default function Main() {
    return (
        <main id="mainContent">
            <form id="mainContent__form">
                <label>
                    Email
                </label>
                <input type="email" className="inputForm"/>
                <label>
                    Password
                </label>
                <input type="password" className="inputForm"/>
            </form>
        </main>
    )
}
