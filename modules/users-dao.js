const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Inserts the given user into the database. Then, reads the ID which the database auto-assigned, and adds it
 * to the user.
 * 
 * @param user the user to insert
 */
async function createUser(user) {
    const db = await dbPromise;

    const hash = bcrypt.hashSync(user.password, saltRounds);

    const result = await db.run(SQL`
        insert into users (fname, lname, bio, username, password, dob, avatar) values (${user.fname},${user.lname},${user.bio},${user.username},${hash},${user.dob},${user.avatar})`);
    // Get the auto-generated ID value, and assign it back to the user object.
    console.log(hash);
    user.id = result.lastID;
}

/**
 * Gets the user with the given id from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {number} id the id of the user to get.
 */
async function retrieveUserById(id) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where id = ${id}`);

    return user;
}

/**
 * Gets the user with the given username and password from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} username the user's username
 * @param {string} password the user's password
 */
async function retrieveUserWithCredentials(username, password) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where username = ${username}`);

        console.log(user);
    const match = await bcrypt.compare(password,user.password);

    if (match){
        return user;
    }


 }

/**
 * Gets the user with the given authToken from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} authToken the user's authentication token
 */
async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where authToken = ${authToken}`);

    return user;
}

/**
 * Gets an array of all users from the database.
 */
async function retrieveAllUsers() {
    const db = await dbPromise;

    const users = await db.all(SQL`select * from users`);

    return users;
}

/**
 * Updates the given user in the database, not including auth token
 * 
 * @param user the user to update
 */
async function updateUser(user) {
    const db = await dbPromise;

    //also needs a hash here.

    //maybe loop through all of the new data, and if it's not '' or 
    //not undefined, update it. 
    console.log("From update user:")
    console.log(user)

    if (user.fname!=""){
        await db.run(SQL `update users set fname = ${user.fname}`)
    }


    // await db.run(SQL`
    //     update users
    //     set username = ${user.username}, password = ${user.password},
    //         fname = ${user.fname}, authToken = ${user.authToken}
    //     where id = ${user.id}`);
}

/**
 * Deletes the user with the given id from the database.
 * 
 * @param {number} id the user's id
 */
async function deleteUser(id) {
    const db = await dbPromise;

    await db.run(SQL`
        delete from users
        where id = ${id}`);
}

// Export functions.
module.exports = {
    createUser,
    retrieveUserById,
    retrieveUserWithCredentials,
    retrieveUserWithAuthToken,
    retrieveAllUsers,
    updateUser,
    deleteUser
};
