var rightCounter = 0;
var groupCounter = 0;

var allUsers = [
	{nickname: "admin", password: "1234", groups: ["admin", "manager", "user"]},
	{nickname: "sobakajozhec", password: "ekh228", groups: ["user", "manager"]},
	{nickname: "patriot007", password: "russiaFTW", groups: ["user"]},
	{nickname: undefined, password: undefined, groups: ["guest"]}
];

var allRights = ["manage content", "play games", "delete users", "view site"];

var allGroups = {
	"admin": [allRights[2], allRights[3]],
	"manager": [allRights[0], allRights[3]],
	"user": [allRights[1], allRights[3]],
  "guest": [allRights[3]]
}

function createUser(username, password) {
	if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует")
	if (typeof(username) != "string" || typeof(password) != "string") throw new Error("Входной параметр не имеет тип string");
	for (index = 0; index < allUsers.length; index++)
		if (allUsers[index].nickname == username) throw new Error("Пользователь с таким ником уже существует");
	let newUser = {};
	newUser.nickname = username;
	newUser.password = password;
	newUser.groups = ["user"];
	allUsers.push(newUser);
	return newUser;
}

function compareUsers(u1, u2) {
	if (u1.nickname !== u2.nickname) return false;
	if (u1.password !== u2.password) return false;
	if (u1.groups.length != u2.groups.length) return false;
	for (let i = 0; i < u1.groups.length; i++) {
		if (u1.groups[i] != u2.groups[i]) return false
	}
	return true;
}

function userExists(user) {
	if (typeof(user) != "object") throw new Error("Входной параметр не имеет тип object");
	let index = -1;
	for (let i = 0; i < allUsers.length; i++) {
		if (compareUsers(user, allUsers[i])) index = i;
	}
	if (index == -1) throw new Error("Указанного пользователя не существует");
  return index;
}

function deleteUser(user) {
	if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует")
	if (typeof(user) != "object") throw new Error("Входной параметр не имеет тип object");
	if (Object.keys(user)[0] != "nickname" || Object.keys(user)[1] != "password" || Object.keys(user)[2] != "groups")
		throw new Error("Входной параметр не имеет необходимых ключей");
	allUsers.splice(userExists(user), 1);
}

function users() {
	if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует")
	return allUsers;
}

function createGroup() {
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует")
	let name = "group" + groupCounter++;
	allGroups[name] = [];
}

function groupExists(group) { //вспомогательный
	if (typeof(group) == "string") throw new Error("Входной параметр не имеет тип string") 
	let index = -1;
	for (let i = 0; i < Object.keys(allGroups).length; i++) {
		if (Object.keys(allGroups)[i] == group) index = i;
	}
	if (index == -1) throw new Error("Указанной группы не существует");
	return index;
}

function deleteGroup(group) {
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует")
	if (typeof(group) == "string") throw new Error("Входной параметр не имеет тип string") 
	groupExists(group);
	let count = 0;
	for (let i = 0; i < allUsers.length; i++)
		if (allUsers[i].groups.includes(group)) count++;
	if (count) throw new Error("Нельзя удалить группу, в которой состоят пользователи")
		//вариант - сначала удалить всех пользователей из группы, потом удалить группу
		//removeUserFromGroup(allUsers, group)
	delete allGroups[group];
}

function deleteGroupAnyway(group) {//альтернативный
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует")
	if (typeof(group) == "string") throw new Error("Входной параметр не имеет тип string") 
	groupExists(group);
	for (let i = 0; i < allUsers.length; i++)
		removeUserFromGroup(allUsers, group)
	delete allGroups[group];
}

function groups() {
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует")
	return allGroups;
};

function userGroups(user) {
	if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует")
	if (typeof(user) != "object") throw new Error("Входной параметр не имеет тип object");
	if (Object.keys(user)[0] != "nickname" || Object.keys(user)[1] != "password" || Object.keys(user)[2] != "groups")
		throw new Error("Входной параметр не имеет необходимых ключей");
	let u = userExists(user);
	if (typeof(allUsers[u].groups) == undefined) throw new Error("Пользователь не состоит в каких-либо группах")
	return allUsers[u].groups;
}

function addUserToGroup(user, group) {
	if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует")
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует")
	if (typeof(user) != "object") throw new Error("Входной параметр не имеет тип object");
	if (Object.keys(user)[0] != "nickname" || Object.keys(user)[1] != "password" || Object.keys(user)[2] != "groups")
		throw new Error("Входной параметр не имеет необходимых ключей");
	let u = userExists(user);
	if (typeof(group) != "string") throw new Error("Входной параметр не имеет тип string");
	let g = groupExists(group);
	allUsers[u].groups.push(allGroups[g])
}

function removeUserFromGroup(user, group) {
	if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует")
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует")
	if (typeof(user) != "object") throw new Error("Входной параметр не имеет тип object");
	if (Object.keys(user)[0] != "nickname" || Object.keys(user)[1] != "password" || Object.keys(user)[2] != "groups")
		throw new Error("Входной параметр не имеет необходимых ключей");
	let u = userExists(user);
	if (typeof(group) != "string") throw new Error("Входной параметр не имеет тип string");
	let g = groupExists(group);
	allUsers[u].groups.includes(allGroups[g])
	allUsers[u].groups.splice(g, 1);
}

function createRight() {};

function deleteRight() {};

function groupRights() {};

function rights() {};

function addRightToGroup() {};

function removeRightFromGroup() {};

function login(username, password) {};

function currentUser() {};

function logout() {};

function isAuthorized(user, right) {};
