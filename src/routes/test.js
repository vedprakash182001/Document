const campground = require('../models/campground')
const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.newCampground = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.makeCampground = async (req, res) => {
    const geoLocation = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const camp = new Campground(req.body.campground)
    camp.geometry = geoLocation.body.features[0].geometry
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.author = req.user._id
    await camp.save();
    console.log(camp)
    req.flash('success', 'New campground made successfully!')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp })
}

module.exports.renderEditForm = (async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp })
})

module.exports.update = (async (req, res) => {
    const geoLocation = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const { id } = req.params
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true })
    camp.geometry = geoLocation.body.features[0].geometry
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    await camp.save();
    if (req.body.deleteImages){
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Campground updated successfully!')
    res.redirect(`/campgrounds/${camp._id}`)
})

module.exports.delete = (async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Campground deleted successfully!')
    res.redirect('/campgrounds')
})