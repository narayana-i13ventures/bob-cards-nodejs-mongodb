import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ThinkBeyondSchema = new Schema({
    cardName: {
        type: String,
        default: ''
    },
    selected: {
        type: Boolean,
        default: false,
    },
    cardInfo: [
        {
            heading: {
                type: String
            },
            text: {
                type: String
            },
            placeholder: {
                type: String
            }
        }
    ],
    started: {
        type: Boolean,
        default: false
    },
    complete: {
        type: Boolean,
        default: false
    },
    locked: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
    },
    open: {
        type: Boolean,
        default: false
    },
    bmc_status: {
        type: String
    },
    cardNumber: {
        type: Number
    }
}, {
    versionKey: false
});

ThinkBeyondSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    return obj;
};

// Static method to Get Think Beyond Cards
ThinkBeyondSchema.statics.getThinkBeyond = async function () {
    try {
        return await this.find({});
    } catch (error) {
        throw new Error('Error Fetching Think Beyond Cards: ' + error.message);
    }
};

// Static method to Update Think Beyond Card
ThinkBeyondSchema.statics.updateThinkBeyond = async function (card) {
    try {
        return await this.findByIdAndUpdate(card?.id, card, { new: true });
    } catch (error) {
        throw new Error('Error updating Think Beyond Card: ' + error.message);
    }
};

ThinkBeyondSchema.statics.nextCard = async function (card) {
    try {
        let currentCard = await this.findById(card?.id);

        if (!currentCard) {
            throw new Error('Card not found.');
        }

        for (const prop in card) {
            if (card.hasOwnProperty(prop)) {
                currentCard[prop] = card[prop];
            }
        }
        currentCard.selected = false;
        currentCard.complete = true;
        await currentCard.save();

        const updatedCards = [currentCard];

        const cardsLength = await this.countDocuments();

        if ([4, 7, 10].includes(currentCard.cardNumber)) {
            const previousCardNumber = currentCard.cardNumber - 2;
            const previousCard = await this.findOne({ cardNumber: previousCardNumber });

            if (previousCard) {
                // Update the previous card's bmc_status to 'complete'
                previousCard.bmc_status = 'complete';
                await previousCard.save();
                updatedCards.push(previousCard);
            }
        }

        if (currentCard.cardNumber !== 10) {
            let nextCardNumber = (currentCard.cardNumber + 1) % cardsLength;
            if (nextCardNumber === 0) {
                nextCardNumber = cardsLength; // Handle wrapping around to the first card
            }

            const nextCard = await this.findOne({ cardNumber: nextCardNumber });

            if (nextCard) {
                nextCard.locked = false;
                nextCard.selected = true;
                await nextCard.save();
                updatedCards.push(nextCard);
            }
        }

        return updatedCards;
    } catch (error) {
        throw new Error('Error in nextCard function: ' + error.message);
    }
}

// Define a reset method in your ThinkBeyondSchema
ThinkBeyondSchema.statics.resetThinkBeyond = async function () {
    try {
        // Define the default values for the fields you want to reset
        const defaultValues = {
            selected: false,
            started: false,
            complete: false,
            locked: true,
            open: false,
            bmc_status: '',
        };

        // Update all documents in the collection with the default values
        await this.updateMany({}, { $set: defaultValues });

        // Reset the text field in each object in cardInfo to an empty string for each document
        const updatedDocuments = await this.find({});

        const resetPromises = updatedDocuments.map(async (doc) => {
            doc.cardInfo = doc.cardInfo.map((item) => ({
                heading: item.heading,
                text: '',
                placeholder: item.placeholder,
            }));

            // Set selected to true if cardName is 'What is the change'
            if (doc.cardName === 'What is the change') {
                doc.selected = true;
                doc.locked = false;
            }

            await doc.save();
        });

        await Promise.all(resetPromises);

        return updatedDocuments;
    } catch (error) {
        throw new Error('Error resetting Think Beyond data: ' + error.message);
    }
};

const ThinkBeyond = mongoose.model('thinkbeyond', ThinkBeyondSchema);

export default ThinkBeyond;
