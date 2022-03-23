import logo from "./logos/icon-above-font.svg"

function PageContent() {
    return(
        <div id="pageContainer">
            <header id="headerContainer">
                <nav id="navBar">
                    <img src={logo} width="400px"/>
                </nav>
            </header>
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
        </div>
    )
}

export default PageContent