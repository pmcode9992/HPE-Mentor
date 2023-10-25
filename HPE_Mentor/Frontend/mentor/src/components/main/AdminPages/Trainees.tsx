import {
  Box,
  Button,
  DataTable,
  List,
  NameValueList,
  NameValuePair,
  Text,
  TextInput,
} from "grommet";
import React, { useEffect, useState } from "react";

interface Trainee {
  user_id: number;
  role: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  is_active: boolean;
  is_deleted: boolean;
  first_name: string;
  last_name: string;
}
interface UserData {
  user_id: number;
  role: string;
  enrollments: number[];
  quiz__attempts: number[];
}

function Trainees() {
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchUser, setSearchUser] = useState(0);
  const [userData, setUserData] = useState<UserData>();
  const [displayResults, setDisplayResults] = useState(false);
  const [sort, setSort] = useState({
    property: "user_id",
    direction: "asc",
  });

  const GetTrainees = () => {
    fetch(`http://127.0.0.1:8000/admin/all/users`)
      .then((res) => res.json())
      .then((data) => {
        // Assuming data is an array of trainees
        setTrainees(Object.values(data));
      });
  };

  const DisplayResults = () => {
    fetch(`http://127.0.0.1:8000/admin/user/getdets?userid=${searchUser}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setDisplayResults(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    GetTrainees();
  }, []);

  useEffect(() => {
    console.log(trainees);
  }, [trainees]);

  const filteredTrainees = trainees.filter((trainee) => {
    return (
      trainee.first_name.toLowerCase().includes(search.toLowerCase()) ||
      trainee.last_name.toLowerCase().includes(search.toLowerCase()) ||
      String(trainee.user_id).includes(search)
    );
  });

  return (
    <Box pad={"large"} justify="stretch">
      {trainees ? (
        <>
          <Box gap="medium">
            <Box>
              <TextInput
                placeholder="Get Details - Enter User ID"
                onChange={(e) => {
                  setSearchUser(parseInt(e.target.value));
                }}
              />
              <Button label="search" onClick={() => DisplayResults()} />
              {displayResults === true ? (
                <>
               <Box pad={"small"} border>
                  <Text>
                    User ID - {userData?.user_id} <br />
                    Role - {userData?.role} <br />
                    Enrollments - {String(userData?.enrollments)} <br />
                    Quiz Attempts - {String(userData?.enrollments)}
                  </Text>
                  </Box> 
                </>
              ) : (
                <>No results</>
              )}
            </Box>
            <TextInput
              placeholder="Search trainees..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <DataTable
              columns={[
                { header: "User ID", property: "user_id", primary: true },
                { property: "first_name", header: "First name" },
                { property: "last_name", header: "Last name" },
                { header: "Created at", property: "created_at" },
                { property: "updated_at", header: "Updated at" },
                { property: "deleted_at", header: "Deleted at" },
                { property: "is_active", header: "Is active" },
                { property: "is_deleted", header: "Is deleted" },
              ]}
              data={filteredTrainees}
              step={50}
              sortable
              onSort={(sort) => setSort(sort)}
            />
          </Box>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </Box>
  );
}

export default Trainees;
