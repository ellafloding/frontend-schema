import React, { useState, useRef, useEffect } from 'react';

import 'react-datepicker/dist/react-datepicker.css';

import DatePicker from "react-datepicker";
import axios from "axios";

const DropDownComponent = () => {

    const [combinedLista, setCombinedLista] = useState([]);
    const [activity, setActivity] = useState('');
    const [location, setLocation] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const inputRef = useRef(null);

    const [aktivitetsLista, setAktivitetslista] = useState([]);


    React.useEffect(() => {
        // Fetch kurskod options on component mount
        axios.get('https://cloud.timeedit.net/ltu/web/schedule1/ri105656X45Z0XQ6Z36g1Y40y3036Y32107gQY6Q547520876YQ837.json')
            .then(response => {
                setAktivitetslista(response.data);
                console.log(aktivitetsLista)
            })
            .catch(error => {
                console.error('Error fetching kurskod options', error);
            });
    }, []);


    let javascriptList ={}

    const omdomeStudentFunction = () => {

        // Extract column headers from the API response
        const columnHeaders = [aktivitetsLista.columnheaders];

// Extract reservations from the API response
        const reservations = aktivitetsLista.reservations;

        javascriptList = reservations.map(function (reservation) {
            const listItem = {};

            for (let i = 0; i < columnHeaders.length; i++) {
                listItem["empty"] = reservation.columns[i]
                listItem["activity"] = reservation.columns[i+1]
                listItem["location"] = reservation.columns[i+2]
                listItem["meetingLink"] = reservation.columns[i+6]

            }
            listItem["id"] = reservation.id;
            listItem["startdate"] = reservation.startdate;
            listItem["starttime"] = reservation.starttime;
            listItem["enddate"] = reservation.enddate;
            listItem["endtime"] = reservation.endtime;

            return listItem;
        });

        setCombinedLista(javascriptList)
        console.log(javascriptList)

    };



    let isAllChecked = false

    const handleCheckboxChange = (index) => {
        // Handle checkbox change logic, update the selected state in your data
        const updatedData = [...combinedLista];
        updatedData[index].selected = !updatedData[index].selected;
        setCombinedLista(updatedData);
    };

    const toggleCheckboxes = (cn) => {
        var cbarray = document.getElementsByName(cn);
        for(var i = 0; i < cbarray.length; i++){
            cbarray[i].checked = !isAllChecked
        }

        isAllChecked = !isAllChecked;
    }
    function windowPop(){
        alert("Betygen är skickade till Ladok")

    }
    let saveData = []

    const handleSave = () => {
        for(let i = 0; i<combinedLista.length; i++){

            if(combinedLista[i].selected === true){

                let yearStart = combinedLista[i].startdate.toString().split('-').slice(0,1)
                console.log(yearStart)
                let monthStart = combinedLista[i].startdate.toString().split('-').slice(1,2)
                console.log(monthStart)
                let dayStart = combinedLista[i].startdate.toString().split('-').slice(2,3)
                console.log(dayStart)

                console.log(combinedLista[i].starttime)
                console.log(combinedLista[i].endtime)

                let startHour = combinedLista[i].starttime.toString().split(':').slice(0,1)
                console.log(startHour)
                let startMinute = combinedLista[i].starttime.toString().split(':').slice(1,2)
                console.log(startMinute)
                let startMillisecond = "00"

                let yearEnd = combinedLista[i].enddate.toString().split('-').slice(0,1)
                console.log(yearEnd)
                let monthEnd = combinedLista[i].enddate.toString().split('-').slice(1,2)
                console.log(monthEnd)
                let dayEnd = combinedLista[i].enddate.toString().split('-').slice(2,3)
                console.log(dayEnd)

                let endHour = combinedLista[i].endtime.toString().split(':').slice(0,1)
                let endMinute = combinedLista[i].endtime.toString().split(':').slice(1,2)
                console.log(endMinute)
                let endMillisecond = "00"

                //Kanske är något fel med datum formatet
                let dateStart = new Date(yearStart,monthStart-1,dayStart, startHour, startMinute, startMillisecond).toLocaleString()
                let dateEnd = new Date(yearEnd, monthEnd-1, dayEnd, endHour, endMinute, endMillisecond).toLocaleString()
                console.log(dateEnd)
                console.log(dateStart)


                const entry = {
                    title: activity,
                    startTime: dateStart,
                    endTime: dateEnd,
                    location: location,
                    description: meetingLink,
                }
                saveData.push(entry);

                console.log(saveData)
            }
        }



        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw ={
            "contextCode": "user_126754",
            "startAt": "2022-11-25T10:15:00Z",
            "endAt": "2022-11-25T11:45:00Z",
            "title": "API Test!",
        };


        const jsonArray = []

        saveData.forEach((item) => {
            const json ={
                "contextCode": "user_126754",
                "startAt": item.startTime,
                "endAt": item.endTime,
                "title": item.title,
                "description": item.description,
                "locationName": item.location,
            };
            jsonArray.push(json)
        });


        jsonArray.forEach((item) => {
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(item),
                redirect: 'follow'
            };
            fetch("http://localhost:8080/apiproxy/test", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

        });

        
    }

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setIsDatePickerOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [inputRef]);

    return (
        <div>
            <input></input>
            <button onClick={omdomeStudentFunction}>Sök</button>
            <button className="save-button" type="button" onClick={handleSave}>
                Spara
            </button>
        <div>
        <table>
            <thead>
            <tr>
                <th>
                    <input
                        type="checkbox"
                        name = "maincb"
                        checked={isAllChecked} // assuming your data has a property to track selection
                        onChange={() => toggleCheckboxes('cb')}
                    />
                </th>
                <th>Aktivitet</th>
                <th>Startdatum</th>
                <th>Starttid</th>
                <th>Slutdatum</th>
                <th>Sluttid</th>
                <th>Plats, Lokal</th>
                <th>Möteslänk</th>

            </tr>
            </thead>
            <tbody>
            {combinedLista.map((item, index) => (
                <tr key={index}>
                    <td>
                        <input
                            type="checkbox"
                            name="cb"
                            checked={item.selected} // assuming your data has a property to track selection
                            onChange={() => handleCheckboxChange(index)}
                        />
                    </td>
                    <td> <input defaultValue={item.activity} onChange={(e) => setActivity(e.target.value)}>
                    </input> </td>
                    <td>{item.startdate}</td>
                    <td>{item.starttime}</td>
                    <td>{item.enddate}</td>
                    <td>{item.endtime}</td>
                    <td> <input defaultValue={item.location} onChange={(e) => setLocation(e.target.value)}>
                    </input></td>
                    <td><input defaultValue={item.meetingLink} onChange={(e) => setMeetingLink(e.target.value)}>
                    </input></td>


                </tr>
            ))}
            </tbody>
        </table>
        </div>


        </div>
    );
};

export default DropDownComponent;