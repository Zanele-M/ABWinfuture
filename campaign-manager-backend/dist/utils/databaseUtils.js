"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVariantToDatabase = exports.addCampaignToDatabase = void 0;
const database_1 = require("./database");
function addCampaignToDatabase(campaign) {
    const pool = (0, database_1.connectToDatabase)();
    pool.connect((err, client, done) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return;
        }
        const query = 'INSERT INTO campaigns (name, control_name, control_identifier, control_type, status) VALUES ($1, $2, $3, $4, $5)';
        const values = [campaign.name, campaign.control_name, campaign.control_identifier, campaign.control_type, campaign.status];
        client.query(query, values, (err, result) => {
            if (err) {
                console.error('Error adding campaign to the database:', err);
            }
            else {
                console.log('Campaign added to the database!');
            }
            done();
        });
    });
}
exports.addCampaignToDatabase = addCampaignToDatabase;
function addVariantToDatabase(variant) {
    const pool = (0, database_1.connectToDatabase)();
    pool.connect((err, client, done) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return;
        }
        const query = 'INSERT INTO variants (experiment_id, name, identifier, created_at, is_control) VALUES ($1, $2, $3, $4, $5)';
        const values = [variant.campaign_id, variant.name, variant.identifier, variant.created_at, variant.is_control];
        client.query(query, values, (err, result) => {
            if (err) {
                console.error('Error adding variant to the database:', err);
            }
            else {
                console.log('Variant added to the database!');
            }
            done();
        });
    });
}
exports.addVariantToDatabase = addVariantToDatabase;
