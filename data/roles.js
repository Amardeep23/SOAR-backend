const roles = [
    {
        _id: "R01",
        roleName: "SuperAdmin",
        permissions: {
            schools: ["C", "R", "U", "D"],
            classrooms: ["C", "R", "U", "D"],
            students: ["C", "R", "U", "D"],
        },
    },
    {
        _id: "R02",
        roleName: "SchoolAdmin",
        permissions: {
            schools: ["R", "U"],
            classrooms: ["C", "R", "U", "D"],
            students: ["C", "R", "U", "D"],
        },
    },
];

module.exports = roles;
