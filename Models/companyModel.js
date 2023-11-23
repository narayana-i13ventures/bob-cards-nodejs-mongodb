import mongoose from 'mongoose';
const schema = mongoose.Schema;

// Define the schema for the company data
const companySchema = new schema(
    {
        companyName: {
            type: String
        },
        industry: {
            type: String
        },
        vertical: {
            type: String
        },
        companyType: {
            type: String
        },
        companySize: {
            type: String
        },
        companyHeadquarters: {
            type: String
        },
        companyTargetRegions: {
            type: String
        },
        fundingStage: {
            type: String
        },
        annualRevenue: {
            type: String
        },
        businessModel: {
            type: String
        }
    },{
        timestamps:true
    }
);



// Define a custom method to format the document when fetching
companySchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    // obj.id = obj._id.toString();
    delete obj._id;
    return obj;
};

// Static method to create a new company
companySchema.statics.createCompany = async (companyData) => {
    try {
        const newCompany = new Company(companyData);
        await newCompany.save();
        return newCompany;
    } catch (error) {
        throw new Error('Error creating company: ' + error.message);
    }
};

// Static method to get all companies
companySchema.statics.getAllCompanies = async () => {
    try {
        const companies = await Company.find().sort({ createdAt: -1 }); // Sort in descending order by createdAt
        if (companies.length > 0) {
            return companies[0]; // Return the latest added company
        } else {
            return {};
        }
    } catch (error) {
        throw new Error('Error fetching companies: ' + error.message);
    }
};

// Create the Company model using the schema
const Company = mongoose.model('Company', companySchema);
export default Company;
