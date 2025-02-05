function HamburgerMenu({ isOpen }) {
    return (
        <div className={`hamburger ${isOpen ? 'open' : ''}`}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
        </div>
    );
}

export default HamburgerMenu;