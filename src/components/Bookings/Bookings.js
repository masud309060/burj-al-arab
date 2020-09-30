import React, { useContext, useEffect, useState } from 'react';
import { userContext } from '../../App';

const Bookings = () => {
    const [bookings, setBookings] = useState([])
    const [loggedInUser, setLoggedInUser] = useContext(userContext)
    useEffect(() => {
        fetch('http://localhost:5000/bookings?email='+loggedInUser.email, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => setBookings(data))
    },[])

    return (
        <div>
            <h3>You have {bookings.length} bookings</h3>
            <ul>
                {
                    bookings.map(book => 
                    <li key={book._id}>{book.name} from {new Date(book.checkIn).toDateString()} to {new Date(book.checkOut).toDateString()}</li>)
                }
            </ul>
        </div>
    );
};

export default Bookings;