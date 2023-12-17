import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';



import 'react-datepicker/dist/react-datepicker.css';

import DatePicker from "react-datepicker";



const DropDownComponent = () => {
    const [kurskodOptions, setKurskodOptions] = useState([]);
    const [selectedKurskod, setSelectedKurskod] = useState('');
    const [selectedModul, setSelectedModul] = useState('');
    const [uppgiftOptions, setUppgiftOptions] = useState([]);
    const [selectedUppgift, setSelectedUppgift] = useState('');
    const [modulOptions, setModulOptions] = useState([]);
    const [ladokLista, setLadokLista] = useState([]);
    const [omdomeLista, setOmdomeLista] = useState('');
    const [studentLista, setStudentLista] = useState([]);
    const [combinedLista, setCombinedLista] = useState([]);
    const [selectedBetyg, setSelectedBetyg] = useState('');
    const [selectedOption, setSelectedOption] = useState('');

    const [selectedDate, setSelectedDate] = useState(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const inputRef = useRef(null);

    const [aktivitetsLista, setAktivitetslista] = useState([]);

    let combinedData = []

    const instance = axios.create({
        baseURL: 'http://localhost:8080/api/v1',
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar', 'Access-Control-Allow-Origin' : '*'}, withCredentials: false
    });

    const [data, setData] = useState([]);

    React.useEffect(() => {
        // Fetch kurskod options on component mount
        /*axios.get('http://localhost:8080/api/v1/allakurser')
            .then(response => {
                setKurskodOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching kurskod options', error);
            });
        axios.get('http://localhost:8080/api/v1/allastudenter')
            .then(response => {
                setStudentLista(response.data);
            })
            .catch(error => {
                console.error('Error fetching kurskod options', error);
            });*/
        axios.get('https://cloud.timeedit.net/ltu/web/schedule1/ri105656X45Z0XQ6Z36g1Y40y3036Y32107gQY6Q547520876YQ837.json')
            .then(response => {
                setAktivitetslista(response.data);
                console.log(aktivitetsLista)
            })
            .catch(error => {
                console.error('Error fetching kurskod options', error);
            });
    }, []);

    /*React.useEffect(() => {
        // Fetch uppgift options when selectedKurskod changes
        if (selectedKurskod) {
            axios.get('http://localhost:8080/api/v1/finduppgift', {params: { kurskod: selectedKurskod}})
                .then(response => {
                    setUppgiftOptions(response.data);
                })
                .catch(error => {
                    console.error('Error fetching uppgift options', error);
                });
            axios.get('http://localhost:8080/api/v1/findLadok', {params: { kurskod: selectedKurskod}})
                .then(response => {
                    setLadokLista(response.data);
                })
                .catch(error => {
                    console.error('Error fetching uppgift options', error);
                });
            axios.get('http://localhost:8080/api/v1/findmodul', {params: { kurskod: selectedKurskod}})
                .then(response => {
                    setModulOptions(response.data);
                })
                .catch(error => {
                    console.error('Error fetching uppgift options', error);
                });
        }
    }, [selectedKurskod]);
*/


   /* React.useEffect(() => {
        if(selectedUppgift) {
            // Fetch modul options when selectedUppgift changes
            axios.get('http://localhost:8080/api/v1/findomdome', {params: {uppgiftsid: selectedUppgift}})
                .then(response => {
                    setOmdomeLista(response.data);
                    omdomeStudentFunction();
                })
                .catch(error => {
                    console.error('Error fetching uppgift options', error);
                });
        }
    }, [selectedUppgift]);
*/


    let omdomeStudent =[]
    let varfornamn
    let varefternamn
    let varpersonnummer

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
                listItem["teacher"] = reservation.columns[i+3]
                listItem["customer"] = reservation.columns[i+4]
                listItem["comment"] = reservation.columns[i+5]
                listItem["meetingLink"] = reservation.columns[i+6]
                listItem["course"] = reservation.columns[i+7]
                listItem["groups"] = reservation.columns[i+8]
                listItem["campus"] = reservation.columns[i+9]
                listItem["purpose"] = reservation.columns[i+10]
                listItem["equipment"] = reservation.columns[i+11]
                // listItem[columnHeaders[i]] = reservation.columns[i];
            }
            listItem["id"] = reservation.id;
            listItem["startdate"] = reservation.startdate;
            listItem["starttime"] = reservation.starttime;
            listItem["enddate"] = reservation.enddate;
            listItem["endtime"] = reservation.endtime;

            return listItem;
        });

        // Handle checkbox change logic, update the selected state in your data
       /* for(let i = 0; i < omdomeLista.length; i++){
            if(studentLista.some(e => e.studentAnvändare === omdomeLista[i].student_anvandare)){

                let index = studentLista.findIndex(e => e.studentAnvändare === omdomeLista[i].student_anvandare)
                varfornamn = studentLista[index].förnamn
                varefternamn = studentLista[index].efternamn
                varpersonnummer = studentLista[index].personNr
                omdomeStudent[i] = {
                    fornamn: varfornamn,
                    efternamn: varefternamn,
                    personnummer: varpersonnummer,
                    omdome: omdomeLista[i].omdome,
                    uppgift: omdomeLista[i].uppgiftsID
                }

            }

        }
        if (omdomeStudent.length > 0){
            completeList();
        }

    };

    let varbetyg
    let vardatum
    let varbetygstatus
    let varladokID

    const completeList = () => {*/

        /*// Handle checkbox change logic, update the selected state in your data
        for(let i = 0; i < omdomeStudent.length; i++){
            if(ladokLista.some(e => e.personnr === omdomeStudent[i].personnummer)){

                let index = ladokLista.findIndex(e => e.personnr === omdomeStudent[i].personnummer)
                varladokID = ladokLista[index].ladokID

                varbetyg = ladokLista[index].betyg
                vardatum = ladokLista[index].datum
                varbetygstatus = ladokLista[index].betygStatus

                let date = new Date(ladokLista[index].datum)
                vardatum = date.toLocaleDateString()

                combinedData[i] = {
                    ladokID: varladokID,
                    fornamn: omdomeStudent[i].fornamn,
                    efternamn: omdomeStudent[i].efternamn,
                    personnummer: omdomeStudent[i].personnummer,
                    omdome:omdomeStudent[i].omdome,
                    uppgift: omdomeStudent[i].uppgift,
                    betyg: varbetyg,
                    datum: vardatum,
                    betyg_status: varbetygstatus
                }

            }else{
                combinedData[i] = {
                    ladokID: varladokID,
                    fornamn: omdomeStudent[i].fornamn,
                    efternamn: omdomeStudent[i].efternamn,
                    personnummer: omdomeStudent[i].personnummer,
                    omdome:omdomeStudent[i].omdome,
                    betyg: null,
                    datum: null,
                    betyg_status: null
                }
            }


            setSelectedBetyg(combinedData.betyg)


        }

        setCombinedLista(combinedData)*/

        setCombinedLista(javascriptList)
        console.log(javascriptList)

    };

    const combinedListaFunction = () => {
        [...omdomeStudent].forEach((item, index) => {
            if(ladokLista[index] && item.personnummer === ladokLista[index].personnummer){
                combinedData[index] = {
                    selected: false,
                    fornamn: item.fornamn,
                    efternamn: item.efternamn,
                    omdome:item.omdome,
                    betyg:ladokLista[index].betyg,
                    datum:ladokLista[index].datum,
                    betyg_status:ladokLista[index].betyg_status
                }
            }else{
                combinedData[index] = {
                    selected: false,
                    fornamn: item.fornamn,
                    efternamn: item.efternamn,
                    omdome:item.omdome,
                    betyg: "null",
                    datum: "null",
                    betyg_status: "null"
                }
            }

        });
    }


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
    let updateData = []

    const handleSave = () => {
        for(let i = 0; i<combinedLista.length; i++){
            if(combinedLista[i].selected === true){

                if (combinedLista[i].ladokID !== null) {
                    const entry = {
                        ladokID: combinedLista[i].ladokID,
                        personnr: combinedLista[i].personnummer,
                        kurskod: selectedKurskod,
                        modul: selectedModul,
                        datum: selectedDate,
                        betyg: selectedBetyg,
                        betygStatus: selectedOption
                    }
                    saveData.push(entry);
                } else {
                    const entry = {
                        personnr: combinedLista[i].personnummer,
                        kurskod: selectedKurskod,
                        modul: selectedModul,
                        datum: selectedDate,
                        betyg: selectedBetyg,
                        betygStatus: selectedOption
                    }
                    updateData.push(entry);
                }
            }
        }

        const bodyFormData = new FormData();

        saveData.forEach((item) => {
            bodyFormData.append("personnr", item.personnummer);
            bodyFormData.append("kurskod", item.kurskod);
            bodyFormData.append("modul", item.modul);
            bodyFormData.append("datum", item.datum);
            bodyFormData.append("betyg", item.betyg);
            bodyFormData.append("betygStatus", item.betyg_status);
        });

        let JSONData = JSON.stringify(saveData)


       fetch("http://localhost:8080/api/v1/editladok",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSONData
        }).then(() =>{
            console.log("New entry added!")
        })
        windowPop()
        document.location.reload()
        
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
                <th>Lärare, Student</th>
                <th>Kommentar, Kommentar</th>
                <th>Möteslänk</th>
                <th>Kurskod, Kursnamn</th>
                <th>Campus</th>

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
                    <td>{item.activity}</td>
                    <td>{item.startdate}</td>
                    <td>{item.starttime}</td>
                    <td>{item.enddate}</td>
                    <td>{item.endtime}</td>
                    <td>{item.location}</td>
                    <td>{item.teacher}</td>
                    <td>{item.comment}</td>
                    <td>{item.meetingLink}</td>
                    <td>{item.course}</td>
                    <td>{item.campus}</td>


                </tr>
            ))}
            </tbody>
        </table>
        </div>


        </div>
    );
};

export default DropDownComponent;