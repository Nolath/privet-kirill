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
	let index = -1;
	for (let i = 0; i < allUsers.length; i++) {
		if (compareUsers(user, allUsers[i])) index = i;
	}
	if (index == -1) throw new Error("Указанного пользователя не существует");
  return true;
}

function deleteUser(user) {
  if (typeof(user) != "object") throw new Error("Входной параметр не имеет тип object");
  if (Object.keys(user)[0] != "nickname" || 
			Object.keys(user)[1] != "password" || 
			Object.keys(user)[2] != "groups") throw new Error("Входной параметр не имеет необходимых ключей");
  if (userExists(user)) allUsers.splice(index, 1);
}

function users() {
	return allUsers;
}

function createGroup() {
	let name = "group" + groupCounter++;
	allGroups[name] = [];
}

function deleteGroup(group) {
	let index = -1;
	for (let i = 0; i < Object.keys(allGroups).length; i++) {
		if (Object.keys(allGroups)[i] == group) index = i;
	}
	if (index == -1) throw new Error("Указанной группы не существует");
	delete allGroups[group];
}

function groups() {};

function addUserToGroup() {};

function userGroups(user) {
	if (!userExists(user)) throw new Error("Указанного пользователя не существует")
};

function removeUserFromGroup() {};

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
