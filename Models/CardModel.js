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
    },
    userLock: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: '#fff'
    },
    comments: [
        {
            content: {
                type: String
            },
            userId: {
                type: String
            },
            userName: {
                type: String
            },
            liked: {
                type: Boolean,
                default: false
            }
        }
    ],
    shared: [
        {
            username: {
                type: String
            },
            email: {
                type: String
            },
            role: {
                type: String
            },
            owner: {
                type: Boolean
            },

        }
    ]

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

cardSchema.statics.resetCard = async function (card) {
    try {
        const defaultValues = {
            selected: true,
            keyPoints: '',
            locked: true,
            loadingKeyPoints: false,
            chat: [],
            surety: 0,
        };

        // Use spread operators separately for card and defaultValues
        const updatedCard = await this.findByIdAndUpdate(card?.id, { ...card, ...defaultValues }, { new: true });

        return updatedCard;
    } catch (error) {
        throw new Error(`Error resetting card: ${error.message}`);
    }
};

cardSchema.statics.addComment = async function (cardId, comment) {
    try {
        const card = await this.findById(cardId);
        if (!card) {
            throw new Error('Card not found.');
        }

        card.comments.push(comment);
        await card.save();

        return card;
    } catch (error) {
        throw new Error(`Error adding comment: ${error.message}`);
    }
};

cardSchema.statics.deleteComment = async function (cardId, commentId, username) {
    try {
        const card = await this.findById(cardId);
        if (!card) {
            throw new Error('Card not found.');
        }
        // Use filter to exclude the comment with the specified commentId
        card.comments = card.comments.filter(comment => comment.id !== commentId);
        await card.save();
        return { success: true };
    } catch (error) {
        throw new Error(`Error deleting comment: ${error.message}`);
    }
};

cardSchema.statics.addSharedUser = async function (cardId, sharedUser) {
    try {
        const card = await this.findById(cardId);
        if (!card) {
            throw new Error('Card not found.');
        }

        card.shared.push(sharedUser);
        await card.save();

        return card;
    } catch (error) {
        throw new Error(`Error adding shared user: ${error.message}`);
    }
};

cardSchema.statics.deleteSharedUser = async function (cardId, sharedUserId) {
    try {
        const card = await this.findById(cardId);
        if (!card) {
            throw new Error('Card not found.');
        }

        const sharedUserIndex = card.shared.findIndex(user => user._id.toString() === sharedUserId);
        if (sharedUserIndex === -1) {
            throw new Error('Shared user not found.');
        }

        card.shared.splice(sharedUserIndex, 1);
        await card.save();

        return { success: true };
    } catch (error) {
        throw new Error(`Error deleting shared user: ${error.message}`);
    }
}

//________________Future 1________________________

cardSchema.statics.getFuture1BMC = async function () {
    try {
        return await this.find({ future: 1, cardCanvas: 'Business Model Canvas' });
    } catch (error) {
        throw new Error(`Error fetching Future 1 BMC cards: ${error.message}`);
    }
};

cardSchema.statics.Future1BMCNextCard = async function (card) {
    try {
        let currentCard = await this.findOne({ _id: card?.id, future: 1, cardCanvas: 'Business Model Canvas' });
        if (!currentCard) {
            throw new Error('Card not found.');
        }

        for (const prop in card) {
            if (card.hasOwnProperty(prop)) {
                currentCard[prop] = card[prop];
            }
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
        throw new Error('Error in Future1 BMCNextCard function: ' + error.message);
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

cardSchema.statics.Future2BMCNextCard = async function (card) {
    try {
        let currentCard = await this.findOne({ _id: card?.id, future: 2, cardCanvas: 'Business Model Canvas' });
        if (!currentCard) {
            throw new Error('Card not found.');
        }

        for (const prop in card) {
            if (card.hasOwnProperty(prop)) {
                currentCard[prop] = card[prop];
            }
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
        throw new Error('Error in Future2 BMCNextCard function: ' + error.message);
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

cardSchema.statics.Future3BMCNextCard = async function (card) {
    try {
        let currentCard = await this.findOne({ _id: card?.id, future: 3, cardCanvas: 'Business Model Canvas' });
        if (!currentCard) {
            throw new Error('Card not found.');
        }

        for (const prop in card) {
            if (card.hasOwnProperty(prop)) {
                currentCard[prop] = card[prop];
            }
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
        throw new Error('Error in Future3 BMCNextCard function: ' + error.message);
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
    const updatedData = []; // Array to store updated cards

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
                updatedData.push(updatedCard); // Store the updated card in the array
                console.log(`Updated card for ${cardName}`);
            } else {
                console.log(`Card not found for ${cardName}`);
            }
        } catch (error) {
            console.error(`Error updating BMC card for ${cardName}: ${error.message}`);
        }
    }

    return updatedData; // Return the array of updated cards
}

cardSchema.statics.prefillFuture1CVP = async (data) => {
    const updatedData = []; // Array to store updated cards

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
                updatedData.push(await updatedCard); // Store the updated card in the array
                console.log(`Updated card for ${cardName}`);
            } else {
                console.log(`Card not found for ${cardName}`);
            }
        } catch (error) {
            console.error(`Error updating CVP card for ${cardName}: ${error.message}`);
        }
    }

    return updatedData; // Return the array of updated cards
}


const Card = mongoose.model('card', cardSchema);

export default Card;
