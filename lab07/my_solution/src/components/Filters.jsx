import PropTypes from 'prop-types';
import { ListGroup, NavItem } from "react-bootstrap";
import { NavLink } from "react-router";

function Filters({ items }) {
    const filterArray = Object.entries(items);

    return (
        <ListGroup as="ul" variant="flush" className="nav nav-pills flex-column gap-2 mb-auto">
            {filterArray.map(([filterName, { label, url }]) => (
                <NavItem key={filterName}>
                    <NavLink
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : 'link-dark'}`}
                        to={url}
                        end
                    >
                        {label}
                    </NavLink>
                </NavItem>
            ))}
        </ListGroup>
    );
}

Filters.propTypes = {
    items: PropTypes.object,
};

export default Filters;
