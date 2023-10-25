import React, { useEffect, useState } from "react";
import { DataTable, Text, Box, TextInput } from "grommet";

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

function Trainees() {
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState({
    property: "user_id",
    direction: "asc",
  });

  const GetTrainees = () => {
    fetch(`http://127.0.0.1:8000/admin/all/users`)
      .then((res) => res.json())
      .then((data) => {
        // Assuming data is an array of trainees
        setTrainees(data);
      });
  };

  useEffect(() => {
    GetTrainees();
  }, []);

  const columns = [
    {
      property: "user_id",
      header: <Text>User ID</Text>,
      render: (data: Trainee) => data.user_id,
    },
    {
      property: "first_name",
      header: <Text>First Name</Text>,
      render: (data: Trainee) => data.first_name,
    },
    {
      property: "last_name",
      header: <Text>Last Name</Text>,
      render: (data: Trainee) => data.last_name,
    },
    {
      property: "role",
      header: <Text>Role</Text>,
      render: (data: Trainee) => data.role,
    },
    {
      property: "is_active",
      header: <Text>Is Active</Text>,
      render: (data: Trainee) => (data.is_active ? "Yes" : "No"),
    },
  ];

  const filteredTrainees = trainees.filter((trainee) => {
    return (
      trainee.first_name.toLowerCase().includes(search.toLowerCase()) ||
      trainee.last_name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Box>
      <TextInput
        placeholder="Search trainees..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <DataTable
        columns={columns}
        data={filteredTrainees}
        sortable
        
        onSort={(sort) => setSort(sort)}
      />
    </Box>
  );
}

export default Trainees;
