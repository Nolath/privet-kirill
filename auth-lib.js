function users() {
	if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует");
	return allUsers;
};

function createUser(username, password) {
	if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует");
	if (typeof(username) != "string" || typeof(password) != "string") throw new Error("Входной параметр не имеет тип string");
	for (index = 0; index < allUsers.length; index++)
		if (allUsers[index].nickname == username) throw new Error("Пользователь с таким ником уже существует");
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

function userExists(user) {//вспомогательный
	if (typeof(user) != "object") throw new Error("Входной параметр не имеет тип object");
	let index = -1;
	for (let i = 0; i < allUsers.length; i++) 
		if (compareUsers(user, allUsers[i])) {
			index = i;
			break;
	}
	if (index == -1) throw new Error("Указанного пользователя не существует");
  return index;
};

function deleteUser(user) {
	if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует");
	if (typeof(user) != "object") throw new Error("Входной параметр не имеет тип object");
	if (Object.keys(user)[0] != "nickname" || Object.keys(user)[1] != "password" || Object.keys(user)[2] != "groups")
		throw new Error("Входной параметр не имеет необходимых ключей");
	if (session.includes(user.nickname)) session.splice(session.indexOf(user.nickname), 1);
	allUsers.splice(userExists(user), 1);
};

function groups() {
	if (typeof(allRights) == "undefined") throw new Error("База прав не существует");
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует");
	return allGroups;
};

function createGroup() {
	if (typeof(allRights) == "undefined") throw new Error("База прав не существует");
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует");
	let name = "group" + groupCounter++;
	allGroups[name] = [];
};

function groupExists(group) { //вспомогательный
	if (typeof(group) == "string") throw new Error("Входной параметр не имеет тип string");
	let index = -1;
	for (let i = 0; i < Object.keys(allGroups).length; i++)
		if (Object.keys(allGroups)[i] == group) {
			index = i;
			break;
	}
	if (index == -1) throw new Error("Указанной группы не существует");
	return index;
};

function deleteGroup(group) {
	if (typeof(allRights) == "undefined") throw new Error("База прав не существует");
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует");
	if (typeof(group) == "string") throw new Error("Входной параметр не имеет тип string");
	groupExists(group);
	let count = 0;
	for (let i = 0; i < allUsers.length; i++)
		if (allUsers[i].groups.includes(group)) count++;
	if (count) throw new Error("Нельзя удалить группу, в которой состоят пользователи")
	delete allGroups[group];
};

function deleteGroupAnyway(group) {//альтернативный
	if (typeof(allRights) == "undefined") throw new Error("База прав не существует");
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует");
	if (typeof(group) == "string") throw new Error("Входной параметр не имеет тип string");
	groupExists(group);
	for (let i = 0; i < allUsers.length; i++)
		removeUserFromGroup(allUsers, group);
	delete allGroups[group];
};

function userGroups(user) {
	if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует");
	if (typeof(user) != "object") throw new Error("Входной параметр не имеет тип object");
	if (Object.keys(user)[0] != "nickname" || Object.keys(user)[1] != "password" || Object.keys(user)[2] != "groups")
		throw new Error("Входной параметр не имеет необходимых ключей");
	let u = userExists(user);
	if (typeof(allUsers[u].groups) == undefined || allUsers[u].groups.length == 0) 
		throw new Error("Пользователь не состоит в каких-либо группах");
	return allUsers[u].groups;
};

function addUserToGroup(user, group) {
	if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует");
	if (typeof(allRights) == "undefined") throw new Error("База прав не существует");
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует");
	if (typeof(user) != "object") throw new Error("Входной параметр не имеет тип object");
	if (Object.keys(user)[0] != "nickname" || Object.keys(user)[1] != "password" || Object.keys(user)[2] != "groups")
		throw new Error("Входной параметр не имеет необходимых ключей");
	let u = userExists(user);
	if (typeof(group) != "string") throw new Error("Входной параметр не имеет тип string");
	let g = groupExists(group);
	if (allUsers[u].groups.includes(Object.keys(allGroups)[g])) throw new Error("Пользователь уже состоит в этой группе");
	allUsers[u].groups.push(Object.keys(allGroups)[g]);
};

function removeUserFromGroup(user, group) {
	if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует");
	if (typeof(allRights) == "undefined") throw new Error("База прав не существует");
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует");
	if (typeof(user) != "object") throw new Error("Входной параметр не имеет тип object");
	if (Object.keys(user)[0] != "nickname" || Object.keys(user)[1] != "password" || Object.keys(user)[2] != "groups")
		throw new Error("Входной параметр не имеет необходимых ключей");
	let u = userExists(user);
	if (typeof(group) != "string") throw new Error("Входной параметр не имеет тип string");
	let g = groupExists(group);
	if (!allUsers[u].groups.includes(Object.keys(allGroups)[g])) throw new Error("Пользователь не состоит в этой группе");
	allUsers[u].groups.splice(g, 1);
};

function createRight() {
	if (typeof(allRights) == "undefined") throw new Error("База прав не существует");
	let name = "right" + rightCounter++;
	allRights.push(name);
};

function deleteRight(right) {
	if (typeof(allRights) == "undefined") throw new Error("База прав не существует");
	if (typeof(right) != "string") throw new Error("Входной параметр не имеет тип string");
	let r = allRights.indexOf(right);
	if (r == -1) throw new Error("Заданного права не существует");
	allRights.splice(r, 1);
};

function groupRights(group) {
	if (typeof(allRights) == "undefined") throw new Error("База прав не существует");
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует");
	if (typeof(group) != "string") throw new Error("Входной параметр не имеет тип string"); 
	groupExists(group);
	return allGroups[group];
};

function rights() {
	if (typeof(allRights) == "undefined") throw new Error("База прав не существует");
	return allRights;
};

function addRightToGroup(right, group) {
	if (typeof(allRights) == "undefined") throw new Error("База прав не существует");
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует");
	if (typeof(group) != "string" ||) throw new Error("Входной параметр не имеет тип string");
	if (typeof(right) != "string") throw new Error("Входной параметр не имеет тип string");
	let r = allRights.indexOf(right);
	if (r == -1) throw new Error("Заданного права не существует");
	groupExists(group);
	if (allGroups[group].includes(allRights[r])) throw new Error("Группа уже имеет данное право");
	allGroups[group].push(allRights[r]);
};

function removeRightFromGroup(right, group) {
if (typeof(allRights) == "undefined") throw new Error("База прав не существует");
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует");
	if (typeof(group) != "string") throw new Error("Входной параметр не имеет тип string");
	if (typeof(right) != "string") throw new Error("Входной параметр не имеет тип string");
	let r = allRights.indexOf(right);
	if (r == -1) throw new Error("Заданного права не существует");
	groupExists(group);
	if (!allGroups[group].includes(allRights[r])) throw new Error("Группа не имеет данного права");
	let rg = allGroups[group].indexOf(right);
	allGroups[group].splice(rg, 1);
};

function login(username, password) {
	if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует");
	if (typeof(username) != "string" || typeof(password) != "string") throw new Error("Входной параметр не имеет тип string");
	if (session.includes(username)) return false;
	var boolka = false;
	for (index = 0; index < allUsers.length; index++)
		if (allUsers[index].nickname != username || allUsers[index].password != password) throw new Error("Указаны неверные данные")
		else boolka = true;
	else {
		currentID = session.length;
		session[currentID] = username;
		currentUser = username;
	}
	return boolka;
};

function login(username) {//гостевой логин
	if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует");
	if (typeof(username) != "string") throw new Error("Входной параметр не имеет тип string");
	if (session.includes(username)) return false;
	for (index = 0; index < allUsers.length; index++)
		if (allUsers[index].nickname == username) throw new Error("Этот никнейм уже занят");
	else {
		currentID = session.length;
		session[currentID] = username;
		currentUser = username;
		let user = {};
		user.nickname = username;
		user.password = undefined;
		user.groups = ["guest"];
		allUsers.push(user);
	}
	return true;
};

function currentUser() {
	let i = session.indexOf(currentUser)
	if (currentUser != session[i]) throw new Error("Ваш профиль был удалён администратором");
  if (i == -1) return undefined;
	else for (index = 0; index < allUsers.length; index++)
		if (allUsers[index].nickname == currentUser) return allUsers[index];
	return undefined;
};

function logout() {
	let i = session.indexOf(currentUser)
  session.splice(i, 1)
	currentID = undefined;
	currentUser = undefined;
};

function isAuthorized(user, right) {
if (typeof(allUsers) == "undefined") throw new Error("База пользователей не существует");
	if (typeof(allRights) == "undefined") throw new Error("База прав не существует");
	if (typeof(allGroups) == "undefined") throw new Error("База групп не существует");
	if (typeof(user) != "object") throw new Error("Входной параметр не имеет тип object");
	if (Object.keys(user)[0] != "nickname" || Object.keys(user)[1] != "password" || Object.keys(user)[2] != "groups")
		throw new Error("Входной параметр не имеет необходимых ключей");
	let r = allRights.indexOf(right);
	if (r == -1) throw new Error("Заданного права не существует");
	let u = userExists(user);
	let grs = allUsers[u].groups;
	if (grs.length == 0) throw new Error("Пользователь не состоит в группах");
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
