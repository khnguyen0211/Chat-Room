let userList = [
    
]
const getUserList = (room) => {
    return userList.filter((user) => user.room === room);
}
const addUser = (user) => {
    userList.push(user);
}
const deleteUser = (id) => {
    userList = userList.filter((user) => user.id !== id);
}

const findUser = (id) => userList.find((user) => user.id === id);

module.exports = {userList, getUserList, addUser, deleteUser, findUser};