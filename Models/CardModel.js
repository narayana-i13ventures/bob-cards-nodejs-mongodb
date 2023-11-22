import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema for the data
const cardSchema = new Schema({
    cardName: {
        type: String,
        default: ''
    },
    cardNumber: {
        type: Number
    },
    selected: {
        type: Boolean,
        default: false,
    },
    keyPoints: {
        type: String,
        default: '',
    },
    locked: {
        type: Boolean,
        default: true,
    },
    loadingKeyPoints: {
        type: Boolean,
        default: false,
    },
    chat: [
        {
            role: String,
            content: String,
        },
    ],
    cardCanvas: {
        type: String,
        default: ''
    },
    future: {
        type: Number,
        default: 0
    },
    size: {
        type: String,
        enum: ['half', 'full'],
        default: 'full',
    },
    labelHeading: {
        type: String,
        default: '',
    },
    label: {
        type: [String],
        default: [],
    },
    surety: {
        type: Number,
        default: 0
    }
}, {
    versionKey: false
});

cardSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    if (obj.chat && Array.isArray(obj.chat)) {
        obj.chat = obj.chat.map(chatItem => {
            const chatObj = { ...chatItem };
            delete chatObj._id;
            return chatObj;
        });
    }

    return obj;
};


cardSchema.statics.updateCard = async function (card) {
    try {
        return await this.findByIdAndUpdate(card?.id, card, { new: true });
    } catch (error) {
        throw new Error(`Error updating Future 1 BMC card: ${error.message}`);
    }
};


cardSchema.statics.getFuture1BMC = async function () {
    try {
        return await this.find({ future: 1, cardCanvas: 'Business Model Canvas' });
    } catch (error) {
        throw new Error(`Error fetching Future 1 BMC cards: ${error.message}`);
    }
};

cardSchema.statics.Future1BMCNextCard = async function (cardId) {
    try {
        const currentCard = await this.findOne({ _id: cardId, future: 1, cardCanvas: 'Business Model Canvas' });
        if (!currentCard) {
            throw new Error('Card not found.');
        }
        currentCard.complete = true;
        currentCard.selected = false;
        await currentCard.save();

        const updatedCards = [currentCard];

        const future1BMCCards = await this.find({ future: 1, cardCanvas: 'Business Model Canvas' });
        const cardsLength = future1BMCCards.length;
        const nextCard = await this.findOne({
            cardNumber: (currentCard.cardNumber + 1) % cardsLength,
            future: 1,
            cardCanvas: 'Business Model Canvas',
        });

        if (nextCard) {
            nextCard.locked = false;
            nextCard.selected = true;
            await nextCard.save();
            updatedCards.push(nextCard);
        }

        return updatedCards;
    } catch (error) {
        throw new Error('Error in Future1BMCNextCard function: ' + error.message);
    }
};

cardSchema.statics.Future1BMCCardChat = async function () {
    try {
        const chatData = await this.find({ future: 1, cardCanvas: 'Business Model Canvas' }, 'cardName chat');
        return chatData.map(card => ({ cardName: card.cardName, chat: card.chat }));
    } catch (error) {
        throw new Error(`Error fetching Future 1 BMC card chat data: ${error.message}`);
    }
};

cardSchema.statics.resetFuture1BMC = async function () {
    try {
        const defaultValues = {
            selected: false,
            keyPoints: '',
            locked: true,
            loadingKeyPoints: false,
            chat: [],
            surety: 0,
        };

        // Update all cards that match the criteria
        await this.updateMany(
            { future: 1, cardCanvas: 'Business Model Canvas' },
            { $set: defaultValues },
            { multi: true } // Add this option to update multiple documents
        );

        // Find and return all the updated cards
        const updatedCards = await this.find({
            future: 1,
            cardCanvas: 'Business Model Canvas',
        });

        // Update the locked and selected properties for each document
        const updatePromises = updatedCards.map(async (doc) => {
            if (doc.cardNumber === 0) {
                doc.locked = false;
                doc.selected = true;
                await doc.save();
            }
        });


        await Promise.all(updatePromises);

        // Return all the updated cards
        return updatedCards;
    } catch (error) {
        throw new Error('Error resetting Card data: ' + error.message);
    }
};





//________________Future 2________________________

cardSchema.statics.getFuture2BMC = async function () {
    try {
        return await this.find({ future: 2, cardCanvas: 'Business Model Canvas' });
    } catch (error) {
        throw new Error(`Error fetching Future 2 BMC cards: ${error.message}`);
    }
};

cardSchema.statics.Future2BMCNextCard = async function (cardId) {
    try {
        const currentCard = await this.findOne({ _id: cardId, future: 2, cardCanvas: 'Business Model Canvas' });
        if (!currentCard) {
            throw new Error('Card not found.');
        }
        currentCard.complete = true;
        currentCard.selected = false;
        await currentCard.save();

        const updatedCards = [currentCard];

        const future1BMCCards = await this.find({ future: 2, cardCanvas: 'Business Model Canvas' });
        const cardsLength = future1BMCCards.length;
        const nextCard = await this.findOne({
            cardNumber: (currentCard.cardNumber + 1) % cardsLength,
            future: 2,
            cardCanvas: 'Business Model Canvas',
        });

        if (nextCard) {
            nextCard.locked = false;
            nextCard.selected = true;
            await nextCard.save();
            updatedCards.push(nextCard);
        }

        return updatedCards;
    } catch (error) {
        throw new Error('Error in Future2 BMC NextCard function: ' + error.message);
    }
};

cardSchema.statics.Future2BMCCardChat = async function () {
    try {
        const chatData = await this.find({ future: 2, cardCanvas: 'Business Model Canvas' }, 'cardName chat');
        return chatData.map(card => ({ cardName: card.cardName, chat: card.chat }));
    } catch (error) {
        throw new Error(`Error fetching Future 2 BMC card chat data: ${error.message}`);
    }
};

cardSchema.statics.resetFuture2BMC = async function () {
    try {
        const defaultValues = {
            selected: false,
            keyPoints: '',
            locked: true,
            loadingKeyPoints: false,
            chat: [],
            surety: 0,
        };

        // Update all cards that match the criteria
        await this.updateMany(
            { future: 2, cardCanvas: 'Business Model Canvas' },
            { $set: defaultValues },
            { multi: true } // Add this option to update multiple documents
        );

        // Find and return all the updated cards
        const updatedCards = await this.find({
            future: 2,
            cardCanvas: 'Business Model Canvas',
        });

        // Update the locked and selected properties for each document
        const updatePromises = updatedCards.map(async (doc) => {
            if (doc.cardNumber === 0) {
                doc.locked = false;
                doc.selected = true;
                await doc.save();
            }
        });


        await Promise.all(updatePromises);

        // Return all the updated cards
        return updatedCards;
    } catch (error) {
        throw new Error('Error resetting Card data: ' + error.message);
    }
};



//________________Future 3________________________

cardSchema.statics.getFuture3BMC = async function () {
    try {
        return await this.find({ future: 3, cardCanvas: 'Business Model Canvas' });
    } catch (error) {
        throw new Error(`Error fetching Future 3 BMC cards: ${error.message}`);
    }
};

cardSchema.statics.Future3BMCNextCard = async function (cardId) {
    try {
        const currentCard = await this.findOne({ _id: cardId, future: 3, cardCanvas: 'Business Model Canvas' });
        if (!currentCard) {
            throw new Error('Card not found.');
        }
        currentCard.complete = true;
        currentCard.selected = false;
        await currentCard.save();

        const updatedCards = [currentCard];

        const future1BMCCards = await this.find({ future: 3, cardCanvas: 'Business Model Canvas' });
        const cardsLength = future1BMCCards.length;
        const nextCard = await this.findOne({
            cardNumber: (currentCard.cardNumber + 1) % cardsLength,
            future: 3,
            cardCanvas: 'Business Model Canvas',
        });

        if (nextCard) {
            nextCard.locked = false;
            nextCard.selected = true;
            await nextCard.save();
            updatedCards.push(nextCard);
        }

        return updatedCards;
    } catch (error) {
        throw new Error('Error in Future2 BMC NextCard function: ' + error.message);
    }
};

cardSchema.statics.Future3BMCCardChat = async function () {
    try {
        const chatData = await this.find({ future: 3, cardCanvas: 'Business Model Canvas' }, 'cardName chat');
        return chatData.map(card => ({ cardName: card.cardName, chat: card.chat }));
    } catch (error) {
        throw new Error(`Error fetching Future 3 BMC card chat data: ${error.message}`);
    }
};

cardSchema.statics.resetFuture3BMC = async function () {
    try {
        const defaultValues = {
            selected: false,
            keyPoints: '',
            locked: true,
            loadingKeyPoints: false,
            chat: [],
            surety: 0,
        };

        // Update all cards that match the criteria
        await this.updateMany(
            { future: 3, cardCanvas: 'Business Model Canvas' },
            { $set: defaultValues },
            { multi: true } // Add this option to update multiple documents
        );

        // Find and return all the updated cards
        const updatedCards = await this.find({
            future: 3,
            cardCanvas: 'Business Model Canvas',
        });

        // Update the locked and selected properties for each document
        const updatePromises = updatedCards.map(async (doc) => {
            if (doc.cardNumber === 0) {
                doc.locked = false;
                doc.selected = true;
                await doc.save();
            }
        });


        await Promise.all(updatePromises);

        // Return all the updated cards
        return updatedCards;
    } catch (error) {
        throw new Error('Error resetting Card data: ' + error.message);
    }
};






cardSchema.statics.getFuture1CVP = async function () {
    try {
        return await this.find({ future: 1, cardCanvas: 'Customer Value Proposition Canvas' });
    } catch (error) {
        throw new Error(`Error fetching Future 1 CVP cards: ${error.message}`);
    }
};

cardSchema.statics.getFuture1CVPCardChat = async function () {
    try {
        const chatData = await this.find({ future: 1, cardCanvas: 'Customer Value Proposition Canvas' }, 'cardName chat');
        return chatData.map(card => ({ cardName: card.cardName, chat: card.chat }));
    } catch (error) {
        throw new Error(`Error fetching Future 1 CVP card chat data: ${error.message}`);
    }
};

cardSchema.statics.resetFuture1CVP = async function () {
    try {
        const defaultValues = {
            selected: false,
            keyPoints: '',
            locked: false,
            loadingKeyPoints: false,
            chat: [],
            surety: 0,
        };

        await this.updateMany(
            { future: 1, cardCanvas: 'Customer Value Proposition Canvas' },
            { $set: defaultValues },
            { multi: true }
        );

        const updatedCards = await this.find({
            future: 1,
            cardCanvas: 'Customer Value Proposition Canvas',
        });

        const updatePromises = updatedCards.map(async (doc) => {
            if (doc.cardNumber === 0) {
                doc.selected = true;
                await doc.save();
            }
        });


        await Promise.all(updatePromises);

        // Return all the updated cards
        return updatedCards;
    } catch (error) {
        throw new Error('Error resetting Card data: ' + error.message);
    }
};






cardSchema.statics.prefillFuture1BMC = async (data) => {
    for (const key of Object.keys(data)) {
        const cardName = key;
        const content = data[key].content;
        const surety = data[key].surety;

        try {
            const updatedCard = await Card.findOneAndUpdate(
                { cardName, future: 1, cardCanvas: 'Business Model Canvas' },
                { keyPoints: content, surety, locked: false },
                { new: true }
            );
            if (updatedCard) {
                console.log(`Updated card for ${cardName}`);
            } else {
                console.log(`Card not found for ${cardName}`);
            }
        } catch (error) {
            console.error(`Error updating BMC card for ${cardName}: ${error.message}`);
        }
    }
}
cardSchema.statics.prefillFuture1CVP = async (data) => {
    for (const key of Object.keys(data)) {
        const cardName = key;
        const content = data[key].content;
        const surety = data[key].surety;

        try {
            const updatedCard = await Card.findOneAndUpdate(
                { cardName, future: 1, cardCanvas: 'Customer Value Proposition Canvas' },
                { keyPoints: content, surety, locked: false },
                { new: true }
            );
            if (updatedCard) {
                console.log(`Updated card for ${cardName}`);
            } else {
                console.log(`Card not found for ${cardName}`);
            }
        } catch (error) {
            console.error(`Error updating CVP card for ${cardName}: ${error.message}`);
        }
    }
}


const Card = mongoose.model('card', cardSchema);

export default Card;
