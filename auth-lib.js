function users() {
	if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует");
	return allUsers;
};

function createUser(username, password) {
	if (typeof(allUsers) == 'undefined') throw new Error('База пользователей не существует');
	if (typeof(username) != 'string' || typeof(password) != 'string') throw new Error('Входной параметр не имеет тип string');
	for (index = 0; index < allUsers.length; index++)
		if (allUsers[index].nickname == username) throw new Error('Пользователь с таким ником уже существует');
	let newUser = {};
	newUser.nickname = username;
	newUser.password = password;
	newUser.groups = [];
	allUsers.push(newUser);
	return newUser;
};

function compareUsers(u1, u2) {//вспомогательный
	if (u1.nickname !== u2.nickname) return false;
	if (u1.password !== u2.password) return false;
	if (u1.groups.length != u2.groups.length) return false;
	for (let i = 0; i < u1.groups.length; i++) 
		if (u1.groups[i] != u2.groups[i]) return false;
	return true;
};

function compareAccounts(u1, u2) {//вспомогательный
	if (u1.nickname !== u2.nickname) return false;
	if (u1.password !== u2.password) return false;
	return true;
};

function userExists(user) {//вспомогательный
	if (typeof(user) != 'object') throw new Error('Входной параметр не имеет тип object');
	let index = -1;
	for (let i = 0; i < allUsers.length; i++) 
		if (compareUsers(user, allUsers[i])) {
			index = i;
			break;
	}
	if (index == -1) throw new Error('Указанного пользователя не существует');
  return index;
};

function deleteUser(user) {
	if (typeof(allUsers) == 'undefined') throw new Error('База пользователей не существует');
	if (typeof(user) != 'object') throw new Error('Входной параметр не имеет тип object');
	if (Object.keys(user)[0] != 'nickname' || Object.keys(user)[1] != 'password' || Object.keys(user)[2] != 'groups')
		throw new Error('Входной параметр не имеет необходимых ключей');
	allUsers.splice(userExists(user), 1);
};

function groups() {
	if (typeof(allRights) == 'undefined') throw new Error('База прав не существует');
	if (typeof(allGroups) == 'undefined') throw new Error('База групп не существует');
	return Object.keys(allGroups);
};

function createGroup() {
	if (typeof(allRights) == 'undefined') throw new Error('База прав не существует');
	if (typeof(allGroups) == 'undefined') throw new Error('База групп не существует');
	let name = 'group' + groupCounter++;
	allGroups[name] = [];
	let i = Object.keys(allGroups).length;
	return Object.keys(allGroups)[i - 1];
};

function groupExists(group) { //вспомогательный
	if (typeof(group) != 'string') throw new Error('Входной параметр {group} не имеет тип string'.replace('{group}', group).replace('{group}', group));
	let index = -1;
	for (let i = 0; i < Object.keys(allGroups).length; i++)
		if (Object.keys(allGroups)[i] == group) {
			index = i;
			break;
	}
	return index;
};

function deleteGroup(group) {
	if (typeof(allRights) == 'undefined') throw new Error('База прав не существует');
	if (typeof(allGroups) == 'undefined') throw new Error('База групп не существует');
	let g = groupExists(group);
	if (g == -1) throw new Error('Указанной группы не существует');
	let count = [];
	for (let i = 0; i < allUsers.length; i++)
		if (allUsers[i].groups.includes(group)) count.push(allUsers[i]);
	if (count.length != 0)
	for (let j = 0; j < count.length; j++)
		removeUserFromGroup(count[j], group);
	delete allGroups[group];
	arguments[0] = undefined;
};

function userGroups(user) {
	if (typeof(allUsers) == 'undefined') throw new Error('База пользователей не существует');
	if (typeof(user) != 'object') throw new Error('Входной параметр не имеет тип object');
	if (Object.keys(user)[0] != 'nickname' || Object.keys(user)[1] != 'password' || Object.keys(user)[2] != 'groups')
		throw new Error('Входной параметр не имеет необходимых ключей');
	let u = userExists(user);
	if (typeof(allUsers[u].groups) == undefined) 
		throw new Error('Пользователь не состоит в каких-либо группах');
	return allUsers[u].groups;
};

function addUserToGroup(user, group) {
	if (typeof(allUsers) == 'undefined') throw new Error('База пользователей не существует');
	if (typeof(allRights) == 'undefined') throw new Error('База прав не существует');
	if (typeof(allGroups) == 'undefined') throw new Error('База групп не существует');
	if (typeof(user) != 'object') throw new Error('Входной параметр не имеет тип object');
	if (Object.keys(user)[0] != 'nickname' || Object.keys(user)[1] != 'password' || Object.keys(user)[2] != 'groups')
		throw new Error('Входной параметр не имеет необходимых ключей');
	let u = userExists(user);
	let g = groupExists(group);
	if (!allUsers[u].groups.includes(Object.keys(allGroups)[g])) allUsers[u].groups.push(Object.keys(allGroups)[g]);
	//else throw new Error('Пользователь уже состоит в этой группе'); //тест ругался на эту штуку
};

function removeUserFromGroup(user, group) {
	if (typeof(allUsers) == 'undefined') throw new Error('База пользователей не существует');
	if (typeof(allRights) == 'undefined') throw new Error('База прав не существует');
	if (typeof(allGroups) == 'undefined') throw new Error('База групп не существует');
	if (typeof(user) != 'object') throw new Error('Входной параметр не имеет тип object');
	if (Object.keys(user)[0] != 'nickname' || Object.keys(user)[1] != 'password' || Object.keys(user)[2] != 'groups')
		throw new Error('Входной параметр не имеет необходимых ключей');
	let u = userExists(user);
	let g = groupExists(group);
	if (g == -1) throw new Error('Указаной группы не существует');
	if (!allUsers[u].groups.includes(Object.keys(allGroups)[g])) throw new Error('Пользователь не состоит в этой группе');
	else {
		let ug = allUsers[u].groups.indexOf(group);
		allUsers[u].groups.splice(ug, 1);
	}
};

function createRight() {
	if (typeof(allRights) == 'undefined') throw new Error('База прав не существует');
	let name = 'right' + rightCounter++;
	allRights.push(name);
	return allRights[allRights.length - 1];
};

function deleteRight(right) {
	if (typeof(allRights) == 'undefined') throw new Error('База прав не существует');
	if (typeof(right) != 'string') throw new Error('Входной параметр не имеет тип string');
	let r = allRights.indexOf(right);
	if (r == -1) throw new Error('Заданного права не существует');
	for (var key in allGroups)
	{
		let k = allGroups[key].indexOf(right)
		if (k != -1) allGroups[key].splice(k, 1);
	}
	allRights.splice(r, 1);
};

function groupRights(group) {
	if (typeof(allRights) == 'undefined') throw new Error('База прав не существует');
	if (typeof(allGroups) == 'undefined') throw new Error('База групп не существует');
	if (typeof(group) != 'string') throw new Error('Входной параметр не имеет тип string'); 
	groupExists(group);
	return allGroups[group];
};

function rights() {
	if (typeof(allRights) == 'undefined') throw new Error('База прав не существует');
	return allRights;
};

function addRightToGroup(right, group) {
	if (typeof(allRights) == 'undefined') throw new Error('База прав не существует');
	if (typeof(allGroups) == 'undefined') throw new Error('База групп не существует');
	if (typeof(group) != 'string') throw new Error('Входной параметр не имеет тип string');
	if (typeof(right) != 'string') throw new Error('Входной параметр не имеет тип string');
	let r = allRights.indexOf(right);
	if (r == -1) throw new Error('Заданного права не существует');
	groupExists(group);
	if (!allGroups[group].includes(allRights[r])) allGroups[group].push(allRights[r]);
	//else throw new Error('Группа уже имеет данное право'); //тест ругался на эту штуку
};

function removeRightFromGroup(right, group) {
if (typeof(allRights) == 'undefined') throw new Error('База прав не существует');
	if (typeof(allGroups) == 'undefined') throw new Error('База групп не существует');
	if (typeof(group) != 'string') throw new Error('Входной параметр не имеет тип string');
	if (typeof(right) != 'string') throw new Error('Входной параметр не имеет тип string');
	let r = allRights.indexOf(right);
	if (r == -1) throw new Error('Заданного права не существует');
	groupExists(group);
	if (!allGroups[group].includes(allRights[r])) throw new Error('Группа не имеет данного права');
	let rg = allGroups[group].indexOf(right);
	allGroups[group].splice(rg, 1);
};

function login(username, password) {
	if (typeof(allUsers) == 'undefined') throw new Error('База пользователей не существует');
	if (typeof(username) != 'string' || typeof(password) != 'string') throw new Error('Входной параметр не имеет тип string');
	let user = {nickname: username, password: password};
	let temp = -1;
	for (let i = 0; i < allUsers.length; i++) {
		if (compareAccounts(user, allUsers[i])) {
			user = allUsers[i];
			temp = i;
			break;
		}
	}
	if (temp == -1) throw new Error("Указаны неверные данные");
	if (logged == undefined) {
		logged = user;
		return true;
	}
	return false;
}

function currentUser() {
	return logged;
};

function logout() {
	logged = undefined;
};

function isAuthorized(user, right) {
if (typeof(allUsers) == 'undefined') throw new Error('База пользователей не существует');
	if (typeof(allRights) == 'undefined') throw new Error('База прав не существует');
	if (typeof(allGroups) == 'undefined') throw new Error('База групп не существует');
	if (typeof(user) != 'object') throw new Error('Входной параметр не имеет тип object');
	if (Object.keys(user)[0] != 'nickname' || Object.keys(user)[1] != 'password' || Object.keys(user)[2] != 'groups')
		throw new Error('Входной параметр не имеет необходимых ключей');
	let r = allRights.indexOf(right);
	if (r == -1) throw new Error('Заданного права не существует');
	let u = userExists(user);
	let grs = allUsers[u].groups;
	if (grs.length == 0) throw new Error('Пользователь не состоит в группах');
	let rights = [];
	for (let i = 0; i < grs.length; i++)
		rights = rights.concat(allGroups[grs[i]]);
	let obj = {};
	for (let j = 0; j < rights.length; j++) {
    let str = rights[j];
    obj[str] = true;
  }
	rights = Object.keys(obj);
	if (rights.includes(right)) return true;
	else return false;
};

//сила полезного действия

var logged = undefined;
var rightCounter = 0;
var groupCounter = 0;
var allUsers = [
	{nickname: "admin", password: "1234", groups: ["admin", "manager", "user"]},
	{nickname: "sobakajozhec", password: "ekh228", groups: ["user", "manager"]},
	{nickname: "patriot007", password: "russiaFTW", groups: ["user"]},
	{nickname: "SimeonLoki", password: undefined, groups: ["guest"]}
];
var allRights = ["manage content", "play games", "delete users", "view site"];
var allGroups = {
	"admin": [allRights[2], allRights[3]],
	"manager": [allRights[0], allRights[3]],
	"user": [allRights[1], allRights[3]],
	"guest": [allRights[3]]
}

createUser('vassily', '123GTRA');
createUser('Ig0rs', 'longenoughpassword');
createUser('Kilg%re', 'kill_the_flash');
createUser('ashot_oneshot', 'n4rdY');
users();
for (let i = 0; i < 3; i++) {
	createRight();	
}
rights()
for (let i = 0; i < 2; i++) {
	createGroup();	
}
groups()
addRightToGroup(allRights[allRights.length - 3], allGroups[Object.keys(allGroups)[Object.keys(allGroups).length - 2]]);
addRightToGroup(allRights[allRights.length - 2], allGroups[Object.keys(allGroups)[Object.keys(allGroups).length - 1]]);
addRightToGroup(allRights[allRights.length - 3], allGroups[Object.keys(allGroups)[Object.keys(allGroups).length - 1]]);
addRightToGroup(allRights[allRights.length - 3], allGroups[Object.keys(allGroups)[0]]);
addRightToGroup(allRights[allRights.length - 1], allGroups[Object.keys(allGroups)[0]]);
groupRights(Object.keys(allGroups)[0]);
groupRights(Object.keys(allGroups)[Object.keys(allGroups).length - 2]);
groupRights(Object.keys(allGroups)[Object.keys(allGroups).length - 1]);
addUserToGroup(allUsers[allUsers.length - 4], allGroups[Object.keys(allGroups)[Object.keys(allGroups).length - 2]])
addUserToGroup(allUsers[allUsers.length - 3], allGroups[Object.keys(allGroups)[Object.keys(allGroups).length - 2]])
addUserToGroup(allUsers[allUsers.length - 2], allGroups[Object.keys(allGroups)[Object.keys(allGroups).length - 2]])
addUserToGroup(allUsers[allUsers.length - 2], allGroups[Object.keys(allGroups)[0]])
addUserToGroup(allUsers[allUsers.length - 1], allGroups[Object.keys(allGroups)[0]])
userGroups(allUsers[allUsers.length - 4]);
userGroups(allUsers[allUsers.length - 3]);
userGroups(allUsers[allUsers.length - 2]);
userGroups(allUsers[allUsers.length - 1]);
deleteUser(allUsers[allUsers.length - 3]);
deleteUser(allUsers[1]);
deleteGroup(allGroups[Object.keys(allGroups)[Object.keys(allGroups).length - 1]]);
deleteGroup(allGroups[Object.keys(allGroups)[3]]);
deleteRight(allRights[allRights.length - 2]);
deleteRight(allRights[2]);
removeUserFromGroup(allUsers[allUsers.length - 3], allGroups[Object.keys(allGroups)[Object.keys(allGroups).length - 2]]);
removeUserFromGroup(allUsers[0], 'manager');
removeRightFromGroup(allRights[allRights.length - 1], allGroups[Object.keys(allGroups)[0]]);
removeRightFromGroup(allRights[allRights.length - 3], allGroups[Object.keys(allGroups)[Object.keys(allGroups).length - 2]]);

currentUser();
login('vassily', '123GTRA');
currentUser();
isAuthorized(currentUser(), 'play games')
isAuthorized(currentUser(), allRights[allRights.length - 1])
logout();
currentUser();
