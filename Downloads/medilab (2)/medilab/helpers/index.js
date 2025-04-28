const hbs = require("hbs")

hbs.registerHelper("activeURLHelper", (currentUrl, path) => {
    return currentUrl === path ? "active" : ""
})

hbs.registerHelper("titleHelper", (title) => {
    return title.split("-")[0]
})

hbs.registerHelper("titleHelper2", (title) => {
    return title.split("-")[1]
})

hbs.registerHelper("addressHelper", () => {
    return process.env.SITE_ADDRESS
})

hbs.registerHelper("phoneHelper", () => {
    return process.env.SITE_PHONE
})

hbs.registerHelper("whatsappHelper", () => {
    return process.env.SITE_WHATSAPP
})

hbs.registerHelper("emailHelper", () => {
    return process.env.SITE_EMAIL
})

hbs.registerHelper("dropdownHelper", (selected, value) => {
    if (selected == true || selected == false)
        return selected == value ? 'selected' : ''
    else
        return String(selected) == String(value) ? 'selected' : ''
})

hbs.registerHelper("activeHelper", (value) => {
    return value == true ? 'Yes' : 'No'
})

hbs.registerHelper("timeHelper", (value) => {
    return new Date(value).toLocaleString()
})

hbs.registerHelper("urlHelper", (currentUrl, value) => {
    return currentUrl === value ? true : false
})


hbs.registerHelper('json', function (context) {
    return JSON.stringify(context);
});