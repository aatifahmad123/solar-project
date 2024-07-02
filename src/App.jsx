import { useState, useEffect } from "react";

export default function App() {

  const [data, setData] = useState([]);
  const [employeepass, setEmployeePass] = useState("");
  const [employeename, setEmployeeName] = useState("");
  const [blocked, setBlocked] = useState(0);
  const [editable, setEditable] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [newData, setNewData] = useState("");
  const [editcolumn,setEditColumn] = useState("");

  function handlechange(e) {
    e.preventDefault();
    if (e.target.name === "employeename") {
      setEmployeeName(e.target.value);
    } else if (e.target.name === "employeepass") {
      setEmployeePass(e.target.value);
    }
  }

  function retrieveData(employeename) {
    fetch("https://sheetdb.io/api/v1/p7n56vwtw3738")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter((d) => d.Employee === employeename);
        setData(filteredData);
      });
  }

  function handleclick(e) {
    e.preventDefault();
    fetch("https://sheetdb.io/api/v1/p7n56vwtw3738?sheet=Credentials")
      .then((response) => response.json())
      .then((data) => {
        let found = false;
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].Employee === employeename &&
            data[i].Password === employeepass
          ) {
            found = true;
          }
        }
        if (!found) {
          alert("Employee Not Found");
        } else {
          retrieveData(employeename);
          for (let i = 0; i < data.length; i++) {
            if (data[i].Employee == employeename) {
              setBlocked(data[i]["Number of fields blocked"]);
            }
          }
        }
      });
  }

  function handleEditButton(idx,colname){
    setEditable(true);
    setEditIndex(idx);
    setEditColumn(colname);
  }

  function handleEditChange(e){
    const {name,value} = e.target;
    setNewData(value);
  }

  function handleSave(){
    let idx = data[editIndex].SL;
    fetch(`https://sheetdb.io/api/v1/p7n56vwtw3738/SL/${idx}`, {
    method: 'PATCH',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        data: {
            [editcolumn] : newData
        }
    })
})
  .then((response) => response.json())
  .then((data) => {
    if (data.updated) {
      alert("Data saved successfully");
    } else {
      throw new Error("Error while saving data");
    }
  })
  .catch((error) => {
    alert(error.message);
  })
  .finally(() => {
    setEditColumn("");
    setNewData("");
    setEditIndex(-1);
    setEditable(false);
  });
  }

  function handleBack(){
    setEditColumn("");
    setNewData("");
    setEditIndex(-1);
    setEditable(false);
  }

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && e.key === 'c') || // Ctrl+C
        (e.ctrlKey && e.key === 'x') || // Ctrl+X
        (e.ctrlKey && e.key === 'v') || // Ctrl+V
        (e.ctrlKey && e.key === 's') || // Ctrl+S
        (e.ctrlKey && e.key === 'a') ||   // Ctrl+A
        (e.ctrlKey && e.key === 'p')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4 text-center">
        Google Sheet Data
      </h1>
      <div className="mb-4 flex flex-col sm:flex-row justify-center items-center">
        <input
          type="text"
          onChange={handlechange}
          name="employeename"
          className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
          placeholder="Employee Name"
        />
        <input
          type="password"
          onChange={handlechange}
          name="employeepass"
          className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
          placeholder="Employee Password"
        />
        <button
          onClick={handleclick}
          className="bg-green-600 text-white p-2 rounded w-full sm:w-auto"
        >
          Get Data
        </button>
      </div>
      {data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-2">SL</th>
                <th className="p-2">App. No.</th>
                <th className="p-2">Name of Discom</th>
                <th className="p-2">Customer Name</th>
                <th className="p-2">Consumer Account Number</th>
                <th className="p-2">Mobile</th>
                <th className="p-2">Email Id</th>
                <th className="p-2">Category</th>
                <th className="p-2">SL-KW</th>
                <th className="p-2">Capacity-KW</th>
                <th className="p-2">Phase Type</th>
                <th className="p-2">Address of Premises for Installation</th>
                <th className="p-2">PIN Code</th>
                <th className="p-2">District</th>
                <th className="p-2">Status</th>
                <th className="p-2">Lead assigned to</th>
                <th className="p-2">Payment feedback</th>
                <th className="p-2">Calling by</th>
                <th className="p-2">Call Log Date</th>
                <th className="p-2">Call Log Time</th>
                <th className="p-2">Follow-Up Date</th>
                <th className="p-2">Remarks</th>
                <th className="p-2">Survey needed</th>
                <th className="p-2">PI Sent by</th>
                <th className="p-2">Order Received</th>
                <th className="p-2">Lead Source</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="even:bg-gray-100 odd:bg-white h-52">
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["SL"]}</div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["App.No."]}</div>
                      <div>
                        {blocked < 2 && (editable == false || editIndex != index || editcolumn != 'App.No.')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'App.No.')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'App.No.'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="App.No."
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Name of Discom"]}</div>
                      <div>
                        {blocked < 3 && (editable == false || editIndex != index || editcolumn != 'Name of Discom')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Name of Discom')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Name of Discom'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Name of Discom"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Customer Name"]}</div>
                      <div>
                        {blocked < 4 && (editable == false || editIndex != index || editcolumn != 'Customer Name')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Customer Name')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Customer Name'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Customer Name"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Consumer Account Number"]}</div>
                      <div>
                        {blocked < 5 && (editable == false || editIndex != index || editcolumn != 'Consumer Account Number')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Consumer Account Number')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Consumer Account Number'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Consumer Account Number"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Mobile"]}</div>
                      <div>
                        {blocked < 6 && (editable == false || editIndex != index || editcolumn != 'Mobile')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Mobile')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Mobile'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Mobile"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Email Id"]}</div>
                      <div>
                        {blocked < 7 && (editable == false || editIndex != index || editcolumn != 'Email Id')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Email Id')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Email Id'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Email Id"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Category"]}</div>
                      <div>
                        {blocked < 8 && (editable == false || editIndex != index || editcolumn != 'Category')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Category')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Category'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Category"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["SL-KW"]}</div>
                      <div>
                        {blocked < 9 && (editable == false || editIndex != index || editcolumn != 'SL-KW')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'SL-KW')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'SL-KW'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="SL-KW"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Capacity-KW"]}</div>
                      <div>
                        {blocked < 10 && (editable == false || editIndex != index || editcolumn != 'Capacity-KW')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Capacity-KW')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Capacity-KW'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Capacity-KW"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Phase Type"]}</div>
                      <div>
                        {blocked < 11 && (editable == false || editIndex != index || editcolumn != 'Phase Type')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Phase Type')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Phase Type'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Phase Type"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Address of Premises for Installation"]}</div>
                      <div>
                        {blocked < 12 && (editable == false || editIndex != index || editcolumn != 'Address of Premises for Installation')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Address of Premises for Installation')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Address of Premises for Installation'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Address of Premises for Installation"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["PIN Code"]}</div>
                      <div>
                        {blocked < 13 && (editable == false || editIndex != index || editcolumn != 'PIN Code')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'PIN Code')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'PIN Code'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="PIN Code"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["District"]}</div>
                      <div>
                        {blocked < 14 && (editable == false || editIndex != index || editcolumn != 'District')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'District')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'District'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="District"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Status"]}</div>
                      <div>
                        {blocked < 15 && (editable == false || editIndex != index || editcolumn != 'Status')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Status')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Status'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Status"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Lead asigned to"]}</div>
                      <div>
                        {blocked < 16 && (editable == false || editIndex != index || editcolumn != 'Lead asigned to')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Lead asigned to')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Lead asigned to'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Lead asigned to"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["payment feedback"]}</div>
                      <div>
                        {blocked < 17 && (editable == false || editIndex != index || editcolumn != 'payment feedback')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'payment feedback')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'payment feedback'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="payment feedback"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["CALLING BY"]}</div>
                      <div>
                        {blocked < 18 && (editable == false || editIndex != index || editcolumn != 'CALLING BY')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'CALLING BY')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'CALLING BY'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="CALLING BY"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Call Log Date"]}</div>
                      <div>
                        {blocked < 19 && (editable == false || editIndex != index || editcolumn != 'Call Log Date')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Call Log Date')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Call Log Date'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Call Log Date"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Call Log Time"]}</div>
                      <div>
                        {blocked < 20 && (editable == false || editIndex != index || editcolumn != 'Call Log Time')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Call Log Time')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Call Log Time'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Call Log Time"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Follow-Up Date"]}</div>
                      <div>
                        {blocked < 21 && (editable == false || editIndex != index || editcolumn != 'Follow-Up Date')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Follow-Up Date')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Follow-Up Date'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Follow-Up Date"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["REMARKS"]}</div>
                      <div>
                        {blocked < 22 && (editable == false || editIndex != index || editcolumn != 'REMARKS')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'REMARKS')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'REMARKS'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="REMARKS"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Survey needed"]}</div>
                      <div>
                        {blocked < 23 && (editable == false || editIndex != index || editcolumn != 'Survey needed')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Survey needed')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Survey needed'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Survey needed"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["PI SENT BY"]}</div>
                      <div>
                        {blocked < 24 && (editable == false || editIndex != index || editcolumn != 'PI SENT BY')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'PI SENT BY')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'PI SENT BY'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="PI SENT BY"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Order Received"]}</div>
                      <div>
                        {blocked < 25 && (editable == false || editIndex != index || editcolumn != 'Order Received')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Order Received')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Order Received'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Order Received"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>
                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 h-52">
                    <div className="flex flex-col justify-between items-center h-52">
                      <div className="text-center">{row["Lead Source"]}</div>
                      <div>
                        {blocked < 26 && (editable == false || editIndex != index || editcolumn != 'Lead Source')? (
                          <button className="bg-green-600 text-white p-2 rounded w-full sm:w-auto" onClick={()=>handleEditButton(index,'Lead Source')}>
                            Edit
                          </button>
                        ) : null}
                        {editable == true && editIndex == index && editcolumn == 'Lead Source'? 
                        (
                          <div>
                            <input
                              type="text"
                              className="bg-gray-200 p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                              placeholder="New data"
                              name="Lead Source"
                              onChange={handleEditChange}
                            />
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2"
                              onClick={handleSave}
                            >Save</button>
                            <button
                              className="bg-green-600 text-white p-2 rounded w-full sm:w-auto mt-2 md:ml-2"
                              onClick={handleBack}
                            >Back</button>

                          </div>
                        )
                        : null}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
