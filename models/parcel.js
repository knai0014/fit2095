const mongoose = require('mongoose');

const parcelSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    sender: {
       type: String,
       required: true,
       minLength: 3
    },
    address: {
        type: String,
        required: true,
        minLength: 3
    },
    weight: {
        type: Number,
        required: true,
        validate: {
            validator: function (parcelWeight) {
                return parcelWeight > 0;
            },
            message: 'Weight has to be positive - greater than 0'
        }
    },
    fragile: {
        type: String,
        required: true
    },
    shipmentType: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true,
        validate: {
            validator: function (costValue) {
                return costValue > 0;
            },
            message: 'Cost should be positive - greater than 0'
        }
    }
});

module.exports = mongoose.model('Parcel', parcelSchema);