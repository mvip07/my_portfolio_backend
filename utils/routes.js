const express = require("express")
const routerPath = express.Router()

const rules = require("./rules")
const isAuth = require("./isAuth")
const upload = require("./fileUpload")
const work = require("../controllers/work")
const user = require("../controllers/user")
const main = require("../controllers/main")
const roles = require("../controllers/role")
const about = require("../controllers/about")
const skill = require("../controllers/skill")
const project = require("../controllers/project")
const service = require("../controllers/service")
const visitor = require("../controllers/visitor")
const category = require("../controllers/category")
const language = require("../controllers/language")
const access = require("../controllers/permission")
const education = require("../controllers/education")
const dashboard  = require("../controllers/dashboard")
const extraSkill = require("../controllers/extraSkill")
const technology = require("../controllers/technology")
const usersAndRolesAndPermissions = require("../controllers/authorization")

const socialMedia = require("../controllers/socialMedia")


routerPath.post("/create/permission", isAuth.authenticate, isAuth.authenticate, isAuth.checkRole, access.createPermission);
routerPath.get("/all/list/permissions", isAuth.authenticate, isAuth.authenticate, isAuth.checkRole, access.getPermissions);
routerPath.get("/permission/:permissionId", isAuth.authenticate, isAuth.authenticate, isAuth.checkRole, access.getPermissionById);
routerPath.put("/update/permission/:permissionId", isAuth.authenticate, isAuth.authenticate, isAuth.checkRole, access.updatePermission);
routerPath.delete("/delete/permission/:permissionId", isAuth.authenticate, isAuth.authenticate, isAuth.checkRole, access.deletePermission);


routerPath.post("/create/role", isAuth.authenticate, isAuth.authenticate, isAuth.checkRole, roles.createRole)
routerPath.get("/all/list/roles", isAuth.authenticate, isAuth.authenticate, isAuth.checkRole, roles.getRoles)
routerPath.get("/role/:roleId", isAuth.authenticate, isAuth.authenticate, isAuth.checkRole, roles.getRoleById)
routerPath.put("/update/role/:roleId", isAuth.authenticate, isAuth.authenticate, isAuth.checkRole, roles.updateRole)
routerPath.delete("/delete/role/:roleId", isAuth.authenticate, isAuth.authenticate, isAuth.checkRole, roles.deleteRole)

routerPath.post("/add/permission/:permissionId/role/:roleId", isAuth.authenticate, isAuth.authenticate, isAuth.checkRole, roles.addPermissionToRole)
routerPath.put("/update/permission/:permissionsId/role/:roleId", isAuth.authenticate, isAuth.authenticate, isAuth.checkRole, roles.updatePermissionInRole)
routerPath.delete("/delete/permission/:permissionId/role/:roleId", isAuth.authenticate, isAuth.authenticate, isAuth.checkRole, roles.deletePermissionFromRole)


routerPath.post("/login", user.login);
routerPath.post("/register", rules.userRegister, rules.validate, user.register);

routerPath.post("/send/verification/code", user.sendVerificationCode);
routerPath.post("/confirm/verification/code", user.confirmVerificationCode);

routerPath.post("/forgot/password", user.forgotPassword);
routerPath.post("/reset/password", rules.userPassword, rules.validate, user.resetPassword);

routerPath.get("/all/list/users", isAuth.authenticate, user.getUsers);
routerPath.get("/user/:userId", isAuth.authenticate, user.getUserById);
routerPath.put("/update/user/:userId", rules.userUpdate, rules.validate, user.updateUser);
routerPath.put("/update/user/for/admin/:userId", isAuth.authenticate, rules.userUpdateForAdmin, rules.validate, user.updateUserForAdmin);


routerPath.get("/get/about", isAuth.authenticate, isAuth.checkRole, about.getAbout);
routerPath.delete("/delete/about", isAuth.authenticate, isAuth.checkRole, about.deleteAbout);
routerPath.put("/update/about", isAuth.authenticate, isAuth.checkRole, upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'image', maxCount: 1 }]), about.updateAbout);
routerPath.post("/create/about", isAuth.authenticate, isAuth.checkRole, upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'image', maxCount: 1 }]), about.createAbout);

routerPath.get("/get/service", isAuth.authenticate, isAuth.checkRole, service.getAllService)
routerPath.get("/get/service/:id", isAuth.authenticate, isAuth.checkRole, service.getServiceById)
routerPath.delete("/delete/service/:id", isAuth.authenticate, isAuth.checkRole, service.deleteService)
routerPath.post("/create/service", isAuth.authenticate, isAuth.checkRole, upload.single("icon"), service.createService)
routerPath.put("/update/service/:id", isAuth.authenticate, isAuth.checkRole, upload.single("icon"), service.updateService)

routerPath.post("/create/service/:id/item", isAuth.authenticate, isAuth.checkRole, service.createServiceItem)
routerPath.put("/update/service/:serviceId/item/:itemId", isAuth.authenticate, isAuth.checkRole, service.updateServiceItem)
routerPath.delete("/delete/service/:serviceId/item/:itemId", isAuth.authenticate, isAuth.checkRole, service.deleteServiceItem)


routerPath.get("/get/education", isAuth.authenticate, isAuth.checkRole, education.getEducation)
routerPath.post("/create/education", isAuth.authenticate, isAuth.checkRole, education.createEducation)
routerPath.put("/update/education/:id", isAuth.authenticate, isAuth.checkRole, education.updateEducation)
routerPath.delete("/delete/education/:id", isAuth.authenticate, isAuth.checkRole, education.deleteEducation)

routerPath.get("/get/work", isAuth.authenticate, isAuth.checkRole, work.getWork)
routerPath.post("/create/work", isAuth.authenticate, isAuth.checkRole, work.createWork)
routerPath.put("/update/work/:id", isAuth.authenticate, isAuth.checkRole, work.updateWork)
routerPath.delete("/delete/work/:id", isAuth.authenticate, isAuth.checkRole, work.deleteWork)

routerPath.get("/get/technology", isAuth.authenticate, isAuth.checkRole, technology.getTechnology)
routerPath.post("/create/technology", isAuth.authenticate, isAuth.checkRole, technology.createTechnology)
routerPath.put("/update/technology/:id", isAuth.authenticate, isAuth.checkRole, technology.updateTechnology)
routerPath.delete("/delete/technology/:id", isAuth.authenticate, isAuth.checkRole, technology.deleteTechnology)

routerPath.get("/get/category", isAuth.authenticate, isAuth.checkRole, category.getCategory)
routerPath.post("/create/category", isAuth.authenticate, isAuth.checkRole, category.createCategory)
routerPath.put("/update/category/:id", isAuth.authenticate, isAuth.checkRole, category.updateCategory)
routerPath.delete("/delete/category/:id", isAuth.authenticate, isAuth.checkRole, category.deleteCategory)

routerPath.get("/get/project", isAuth.authenticate, isAuth.checkRole, project.getProject)
routerPath.get("/get/all/projects", isAuth.authenticate, isAuth.checkRole, project.getAllProject)
routerPath.delete("/delete/project/:id", isAuth.authenticate, isAuth.checkRole, project.deleteProject)
routerPath.post("/create/project", isAuth.authenticate, isAuth.checkRole, upload.single("image"), project.createProject)
routerPath.put("/update/project/:id", isAuth.authenticate, isAuth.checkRole, upload.single("image"), project.updateProject)

routerPath.post("/create/visitor", visitor.createVisitor)
routerPath.post("/banned/country", visitor.bannedCountry)
routerPath.post("/access/country", isAuth.authenticate, isAuth.checkRole, visitor.accessCountry)
routerPath.get("/get/visitor", isAuth.authenticate, isAuth.checkRole, visitor.getVisitor)

routerPath.get("/dashboard", isAuth.authenticate, isAuth.checkRole, dashboard.Dashboard)

routerPath.get("/get/language", isAuth.authenticate, isAuth.checkRole, language.getLanguage)
routerPath.post("/create/language", isAuth.authenticate, isAuth.checkRole, language.createLanguage)
routerPath.put("/update/language/:id", isAuth.authenticate, isAuth.checkRole, language.updateLanguage)
routerPath.delete("/delete/language/:id", isAuth.authenticate, isAuth.checkRole, language.deleteLanguage)

routerPath.get("/get/skill", isAuth.authenticate, isAuth.checkRole, skill.getSkill)
routerPath.post("/create/skill", isAuth.authenticate, isAuth.checkRole, skill.createSkill)
routerPath.put("/update/skill/:id", isAuth.authenticate, isAuth.checkRole, skill.updateSkill)
routerPath.delete("/delete/skill/:id", isAuth.authenticate, isAuth.checkRole, skill.deleteSkill)

routerPath.get("/get/extra/skill", isAuth.authenticate, isAuth.checkRole, extraSkill.getExtraSkill)
routerPath.post("/create/extra/skill", isAuth.authenticate, isAuth.checkRole, extraSkill.createExtraSkill)
routerPath.put("/update/extra/skill/:id", isAuth.authenticate, isAuth.checkRole, extraSkill.updateExtraSkill)
routerPath.delete("/delete/extra/skill/:id", isAuth.authenticate, isAuth.checkRole, extraSkill.deleteExtraSkill)

routerPath.get("/get/social/media", isAuth.authenticate, isAuth.checkRole, socialMedia.getSocialMedia)
routerPath.delete("/delete/social/media/:id", isAuth.authenticate, isAuth.checkRole, socialMedia.deleteSocialMedia)
routerPath.post("/create/social/media", isAuth.authenticate, isAuth.checkRole, upload.single("icon"), socialMedia.createSocialMedia)
routerPath.put("/update/social/media/:id", isAuth.authenticate, isAuth.checkRole, upload.single("icon"), socialMedia.updateSocialMedia)

routerPath.get("/list/users/roles/permissions", isAuth.authenticate, isAuth.checkRole, usersAndRolesAndPermissions.getListUserAndRoleAndPermission)

routerPath.get("/main", main.mainPage)

module.exports = routerPath