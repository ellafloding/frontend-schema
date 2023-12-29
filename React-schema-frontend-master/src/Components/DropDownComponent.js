import React, { useState, useRef } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";

const DropDownComponent = () => {

    const [combinedLista, setCombinedLista] = useState([]);
    const [activity, setActivity] = useState('');
    const [location, setLocation] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const [activityArray, setActivityArray] = useState([])
    const [aktivitetsLista, setAktivitetslista] = useState([]);
    const [canvasLista, setCanvasLista] = useState([]);

    React.useEffect(() => {
        // Hämtar kalenderevent från Time Edit.
        axios.get('https://cloud.timeedit.net/ltu/web/schedule1/ri105656X45Z0XQ6Z36g1Y40y3036Y32107gQY6Q547520876YQ837.json')
            .then(response => {
                setAktivitetslista(response.data);
                console.log(aktivitetsLista)
            })
            .catch(error => {
                console.error('Error fetching kurskod options', error);
            });
    }, []);

    React.useEffect(() => {
        // Hämtar kalenderevent från Canvas.
        axios.get('http://localhost:8080/apiproxy/canvasget')
            .then(response => {
                setCanvasLista(response.data);
                console.log("canvasLista" + canvasLista)
                console.log(canvasLista)
            })
            .catch(error => {
                console.error('Error fetching kurskod options', error);
            });
    }, []);

    let javascriptList ={}

    const omdomeStudentFunction = () => {
        // Hämtar updaterade kalenderevent från Canvas.
        axios.get('http://localhost:8080/apiproxy/canvasget')
            .then(response => {
                console.log(response)
                setCanvasLista(response.data);
                console.log("canvasLista" + canvasLista)
                console.log(canvasLista)
            })
            .catch(error => {
                console.error('Error fetching kurskod options', error);
            });

        // Tar fram kolumnerna från API-svaret.
        const columnHeaders = [aktivitetsLista.columnheaders];

        // Tar fram reservationer från API-svaret.
        const reservations = aktivitetsLista.reservations;

        //Lägger in API-svaret i en lista.
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

            let yearStart = reservation.startdate.toString().split('-').slice(0,1)
            let monthStart = reservation.startdate.toString().split('-').slice(1,2)
            let dayStart = reservation.startdate.toString().split('-').slice(2,3)
            let startHour = reservation.starttime.toString().split(':').slice(0,1)
            let startMinute = reservation.starttime.toString().split(':').slice(1,2)
            let reservationDate = new Date(yearStart, monthStart-1, dayStart, startHour, startMinute).toISOString()
            console.log(reservationDate)

            //Kollar om eventet är uppladdat på Canvas och sätter status.
            for(let j = 0; j < canvasLista.length; j++){
                let date = new Date(canvasLista[j].start_at).toISOString()
                console.log(date)
                if(date === reservationDate){
                    listItem["uploadStatus"] = "Uppladdad";
                    break;
                }else{
                    listItem["uploadStatus"] = "Inte uppladdad";
                }
            }
            return listItem;
        });
        setCombinedLista(javascriptList)
        console.log(javascriptList)
    };

    let isAllChecked = false

    // Hanterar checkbox logiken.
    const handleCheckboxChange = (index) => {
        const updatedData = [...combinedLista];
        updatedData[index].selected = !updatedData[index].selected;
        setCombinedLista(updatedData);
    };

    //Hanterar checkbox logiken.
    const toggleCheckboxes = (cn) => {
        var cbarray = document.getElementsByName(cn);
        for(var i = 0; i < cbarray.length; i++){
            cbarray[i].checked = !isAllChecked
        }
        isAllChecked = !isAllChecked;
    }

    function windowPop(){
        alert("Eventet är sparat i Canvas")
    }

    let saveData = []
    let uploaded = [];

    //Hanterar uppladdningen till Canvas.
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

                let dateStart = new Date(yearStart,monthStart-1,dayStart, startHour, startMinute, startMillisecond).toLocaleString()
                let dateEnd = new Date(yearEnd, monthEnd-1, dayEnd, endHour, endMinute, endMillisecond).toLocaleString()
                console.log(dateEnd)
                console.log(dateStart)

                    const entry = {
                        id: combinedLista[i].id,
                        title: activity,
                        startTime: dateStart,
                        endTime: dateEnd,
                        location: location,
                        description: meetingLink,
                        uploadStatus: combinedLista[i].uploadStatus
                    }
                    saveData.push(entry);

                uploaded.push(i)
                console.log(uploaded)
                console.log(saveData)
            }
        }

        // Headers för POST.
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const jsonArray = []
        // Gör om datan till Json och lägger i en array.
        saveData.forEach((item) => {
            const json ={
                "contextCode": "user_126753",
                "startAt": item.startTime,
                "endAt": item.endTime,
                "title": item.title,
                "description": item.description,
                "locationName": item.location,
            };
            jsonArray.push(json)
        });

        //Laddar upp alla entries i arrayen till Canvas.
        jsonArray.forEach(async (item) => {
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(JSON.parse(JSON.stringify(item))),
                redirect: 'follow'
            };

            try {
                const response = await fetch("http://localhost:8080/apiproxy/test", requestOptions);
                const result = await response.text();
                console.log(result);
            } catch (error) {
                console.log('error', error);
            }
        });
    }

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
                        checked={isAllChecked}
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
                <th>Status</th>

            </tr>
            </thead>
            <tbody>
                {combinedLista.map((item, index) => (
                <tr key={index}>
                    {canvasLista.includes(item.startdate) ?
                        <td>
                            <input
                                type="checkbox"
                                name="cb"
                                disabled={true}
                            />
                        </td> :
                        <td>
                            <input
                                type="checkbox"
                                name="cb"
                                checked={item.selected}
                                onChange={() => handleCheckboxChange(index)}
                            />
                        </td>}

                    {item.uploadStatus === 'Inte uppladdad' ?
                        <td><input defaultValue={item.activity} onChange={(e) => setActivity(e.target.value)}>
                        </input></td>
                        :
                        <td><input defaultValue={item.activity} disabled={true}/></td>}
                    <td>{item.startdate}</td>
                    <td>{item.starttime}</td>
                    <td>{item.enddate}</td>
                    <td>{item.endtime}</td>
                    {item.uploadStatus === 'Inte uppladdad' ?
                    <td> <input defaultValue={item.location} onChange={(e) => setLocation(e.target.value)}>
                    </input></td>:
                        <td><input defaultValue={item.location} disabled={true}/></td>}

                    {item.uploadStatus === 'Inte uppladdad' ?
                    <td><input defaultValue={item.meetingLink} onChange={(e) => setMeetingLink(e.target.value)}>
                    </input></td>:
                    <td> <input defaultValue={item.meetingLink} disabled={true}/> </td>}
                    <td>{item.uploadStatus}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        </div>
    );
};

export default DropDownComponent;