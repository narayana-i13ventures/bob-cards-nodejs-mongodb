import mongoose from "mongoose";
import moment from "moment";
const schema = mongoose.Schema;

// Define the schema for the company data
const companySchema = new schema(
    {
        companyName: {
            type: String,
        },
        industry: {
            type: String,
        },
        vertical: {
            type: String,
        },
        companyType: {
            type: String,
        },
        companySize: {
            type: String,
        },
        companyHeadquarters: {
            type: String,
        },
        companyTargetRegions: {
            type: String,
        },
        fundingStage: {
            type: String,
        },
        annualRevenue: {
            type: String,
        },
        businessModel: {
            type: String,
        },
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
    },
    {
        timestamps: true,
    }
);

// Define a custom method to format the document when fetching
companySchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    obj.id = obj._id.toString();
    obj.createdAt = moment(obj.createdAt).format("DD/MM/YYYY");
    delete obj._id;
    delete obj.updatedAt;
    return obj;
};

// Static method to create a new company
companySchema.statics.createCompany = async (companyData) => {
    try {
        const newCompany = new Company(companyData);
        await newCompany.save();
        return newCompany;
    } catch (error) {
        throw new Error("Error creating company: " + error.message);
    }
};

// Static method to get all companies
companySchema.statics.getAllCompanies = async () => {
    try {
        const response = await Company.find();
        return response;
    } catch (error) {
        throw new Error("Error fetching companies: " + error.message);
    }
};

companySchema.statics.getCompanyById = async function (companyId) {
    try {
        const company = await this.findById(companyId);
        return company;
    } catch (error) {
        throw new Error("Error fetching company: " + error.message);
    }
};

companySchema.statics.deleteCompanyById = async function (companyId) {
    try {
        const company = await Company.findByIdAndDelete(companyId);
        return { success: true };
    } catch (error) {
        throw new Error("Error fetching company: " + error.message);
    }
};

companySchema.statics.addSharedUser = async function (companyId, sharedUser) {
    try {
        const company = await Company.findById(companyId);
        console.log(company);
        if (!company) {
            throw new Error('Company not found.');
        }

        company.shared.push(...sharedUser);
        await company.save();

        return company;
    } catch (error) {
        throw new Error(`Error adding shared user: ${error.message}`);
    }
};

companySchema.statics.deleteSharedUser = async function (companyId, sharedUserId) {
    try {
        const company = await this.findById(companyId);
        if (!company) {
            throw new Error('Company not found.');
        }

        // Find the index of the shared user
        const sharedUserIndex = company.shared.findIndex(user => user._id == sharedUserId);

        if (sharedUserIndex === -1) {
            throw new Error('Shared user not found.');
        }

        // Remove the shared user from the array
        company.shared.splice(sharedUserIndex, 1);

        // Save the modified company document
        await company.save();

        // Return the updated company
        return company;
    } catch (error) {
        throw new Error(`Error deleting shared user: ${error.message}`);
    }
};



// Create the Company model using the schema
const Company = mongoose.model("Company", companySchema);
export default Company;
