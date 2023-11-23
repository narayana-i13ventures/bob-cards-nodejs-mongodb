import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the schema for the methodology
const methodologySchema = new Schema({
    methodology: String,
    frameworks: [
        {
            name: {
                type: String
            },
            canvases: [
                {
                    name: {
                        type: String,
                    },
                    selected: {
                        type: Boolean
                    },
                    locked: {
                        type: Boolean
                    }, route: {
                        type: String
                    }
                }
            ]
        }
    ]
});
// Define a custom method to format the document when fetching
methodologySchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    // obj.id = obj._id.toString();
    delete obj._id;
    return obj;
};

// Add static methods to the methodologySchema
methodologySchema.statics.getMenu = async function () {
    try {
        const menuData = await Methodology.find({ methodology: "ThinkBeyond" });
        return menuData;
    } catch (error) {
        throw new Error('Failed to fetch menu data: ' + error.message);
    }
};
methodologySchema.statics.setMenu = async function (data) {
    try {
        // Assuming 'data' is an object containing the menu updates
        // Format of 'data': { frameworks: [/* updated frameworks data */] }

        // Update the document with the specified data
        const response = await Methodology.findOneAndUpdate(
            { methodology: 'ThinkBeyond' }, 
            { frameworks: data.frameworks },
            { new: true }
        );
        return response;
    } catch (error) {
        throw new Error('Failed to update menu data: ' + error.message);
    }
};

methodologySchema.statics.setCanvasSelected = async function ({ canvasName, value }) {
    try {
        const methodology = await Methodology.findOne({ methodology: 'ThinkBeyond' });
        if (!methodology) {
            throw new Error(`Methodology with ID ThinkBeyond not found`);
        }

        const framework = methodology.frameworks.find((f) => f.name === 'Micro frameworks');
        if (!framework) {
            throw new Error(`Framework with name Micro Frameworks not found in methodology`);
        }

        // Remove 'selected' attribute on all canvases and set it to 'true' for the given canvas
        framework.canvases.forEach((canvas) => {
            canvas.selected = false;
            if (canvas.name === canvasName) {
                canvas.selected = value;
            }
        });

        await methodology.save();
        return await Methodology.find({ methodology: 'ThinkBeyond' });
    } catch (error) {
        throw new Error(`Error toggling canvas selected: ${error.message}`);
    }
};


methodologySchema.statics.toggleCanvasLocked = async function ({ canvasName, value }) {
    try {
        const methodology = await Methodology.findOne({ methodology: 'ThinkBeyond' });
        if (!methodology) {
            throw new Error(`Methodology with ID ThinkBeyond not found`);
        }

        const framework = methodology.frameworks.find((f) => f.name === 'Micro frameworks');
        if (!framework) {
            throw new Error(`Framework with name Micro Frameworks not found in methodology`);
        }

        // Remove 'selected' attribute on all canvases and set it to 'true' for the given canvas
        framework.canvases.forEach((canvas) => {
            if (canvas.name === canvasName) {
                canvas.locked = value;
            }
        });

        await methodology.save();
        return await Methodology.find({ methodology: 'ThinkBeyond' });
    } catch (error) {
        throw new Error(`Error toggling canvas locked: ${error.message}`);
    }
};


// Create a Mongoose model for the methodology data
const Methodology = mongoose.model('Methodology', methodologySchema);

export default Methodology;
