const { uploadFile, deleteFile } = require("../config/imagekitconfig.js");
const Menu = require("../models/menu.js");
const Dish = require("../models/dish.js");
const { ExpressError } = require("../utils/wrapAsyncAndExpressError");

const createFolderName = (title) => {
    return [...title].reduce((acc, char) => {
        // if (char == ' ') return acc.concat("_");
        if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
            return acc.concat(char);
        }
        return acc;
    }, '');
}

const showMenu = async (req, res) => {
    const menus = await Menu.find({}).populate("dishes");
    res.status(200).json(menus);
}

const createMenu = async (req, res, next) => {
    const { title } = req.body;

    if (!req.file) {
        return next(new ExpressError(400, "Menu Image is required"))
    }
    else {
        const fileName = req.file.originalname;

        const folderName = createFolderName(title);
        const { fileUrl, fileId } = await uploadFile(fileName, `menusection/${folderName}`);
        const newMenu = new Menu({ title, image: fileUrl, imageId: fileId });
        await newMenu.save();

        return res.status(200).json({ success: true, message: "Menu created successfully!" });
    }
}


const destroyMenu = async (req, res) => {
    const { id } = req.params;
    const menu = await Menu.findByIdAndDelete(id).populate("dishes");
    console.log(menu)
    await deleteFile(menu.imageId);
    const dishIds = menu.dishes.map(dish => dish._id);
    await Dish.deleteMany({ _id: { $in: dishIds } });
    await menu.dishes.forEach(async (dish) => {
        await deleteFile(dish.imageId);
    });
    res.status(200).json({ success: true, message: "Menu Deleted SuccessFully!" });
}

const addDish = async (req, res) => {
    const { id } = req.params;
    const { dishName, description, price, tag } = req.body;
    if (!req.file) {
        return next(new ExpressError(400, "Menu Image is required"));
    }

    const fileName = req.file.originalname;
    const menu = await Menu.findById(id);
    console.log(menu.title);
    const { fileId, fileUrl } = await uploadFile(fileName, `menusection/${menu.title.replace(/ /g, "_")}/dishes`);
    const dishDetails = new Dish({ dishName, description, price, tag, dishImage: fileUrl, imageId: fileId });
    await dishDetails.save()
    await Menu.findByIdAndUpdate(id, { $push: { dishes: dishDetails } });
    res.status(200).json({ success: true, message: "Dish Added SuccessFully" });
}

const destroyDish = async (req, res) => {
    const { menuId, dishId } = req.params;
    await Menu.findByIdAndUpdate(menuId, { $pull: { dishes: dishId } });
    const dish = await Dish.findByIdAndDelete(dishId);
    await deleteFile(dish.imageId)
    res.status(200).json({ success: true, message: "Dish removed!" });
}


const updateMenu = async (req, res) => {
    const { title } = req.body;
    const { id } = req.params;
    console.log(req.body);
    if (!req.file) {
        await Menu.findByIdAndUpdate(id, { title: title });
    }
    else {
        const fileName = req.file.originalname;
        const folderName = createFolderName(title);
        const { fileUrl, fileId } = await uploadFile(fileName, `menusection/${folderName}`);
        const oldMenu = await Menu.findByIdAndUpdate(id, { title, image: fileUrl, imageId: fileId });
        oldMenu.imageId && await deleteFile(oldMenu.imageId);
    }
    return res.status(200).json({ success: true, message: "Menu Upadted successfully!" });
}


module.exports = { createMenu, showMenu, destroyMenu, addDish, destroyDish, updateMenu };