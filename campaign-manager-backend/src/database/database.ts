import { Pool, PoolConfig } from "pg";
import { Campaign, Variants, Controls} from "../types";
import { Aggregates } from "../utils/types";
import { rollbar } from "../index";
export class Database {
  private pool: Pool;

  constructor() {
    const isProd = process.env.NODE_ENV === 'production';

    const poolConfig: PoolConfig = {
      user: isProd ? process.env.DB_USER_PROD : process.env.DB_USER_DEV,
      host: isProd ? process.env.DB_HOST_PROD : process.env.DB_HOST_DEV,
      database: isProd ? process.env.DB_NAME_PROD : process.env.DB_NAME_DEV,
      password: isProd ? process.env.DB_PASSWORD_PROD : process.env.DB_PASSWORD_DEV,
      port: Number(isProd ? process.env.DB_PORT_PROD : process.env.DB_PORT_DEV),
    };

    this.pool = new Pool(poolConfig);

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

/**
 * Inserts a new document into a specified table in the database.
 *
 * @param {string} table - The name of the table in which the document should be inserted.
 * @param {any} document - An object representing the document to be inserted. The keys of the object should correspond to the column names of the table, and the values of the object should correspond to the values to be inserted into those columns.
 *
 * @returns {Promise<void>} This method does not return any value.
 *
 * @throws {Error} Will throw an error if the query fails to execute.
 */
async insert(table: string, document: any) {
  const keys = Object.keys(document);
  const values = Object.values(document);
  const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${values.map((_, i) => `$${i + 1}`).join(', ')})`;
  await this.pool.query(query, values);
}


/**
 * Creates a new campaign in the database.
 * This method begins a new transaction in the database, and will roll back the transaction if any part of it fails.
 *
 * @param {string} campaignName - The name of the campaign to be created.
 * @param {string} campaignType - The type of the campaign to be created.
 * @param {Variant[]} variants - An array of variants to be associated with the campaign. Each variant should have a name and identifier.
 * @param {string} controlName - The name of the control to be associated with the campaign.
 * @param {string} controlIdentifier - The identifier of the control to be associated with the campaign.
 *
 * @returns {Promise<void>} This method does not return any value.
 *
 * @throws {Error} Will throw an error if the transaction fails to commit.
 */
async createCampaign(campaignName : string, campaignType: string, variants: any[], controlName: string, controlIdentifier: string ): Promise<void> {
  await this.pool.query('BEGIN');

  try {
    await this.insert('campaigns', { name: campaignName, status: 'running', type: campaignType});
    const { rows } = await this.pool.query('SELECT LASTVAL()');
    const campaignId = rows[0].lastval;
    for (const variant of variants) {
      await this.insert('variants', { campaign_id: campaignId, name: variant.name, identifier: variant.identifier });
    }
    await this.insert('controls', { campaign_id: campaignId, name: controlName, identifier: controlIdentifier });
    await this.pool.query('COMMIT');
  } catch (error) {
    await this.pool.query('ROLLBACK');
    throw error;
  }
}


 /**
 * Retrieves all campaigns from the database regardless of their status.
 *
 * Each campaign contains the following information:
 * - `id`: The unique identifier for the campaign.
 * - `name`: The name of the campaign.
 * - `status`: The current status of the campaign (e.g., running, paused).
 * - `type`: The type of the campaign.
 * - `variants`: An array containing all the variants for the campaign.
 * - `created_at`: The date and time when the campaign was created.
 *
 * @returns {Promise<Campaign[]>} An array of all campaigns.
 */
async getCampaigns(): Promise<Campaign[]> {
  const { rows } = await this.pool.query(`
    SELECT campaigns.*, array_agg(variants) as variants 
    FROM campaigns 
    LEFT JOIN variants ON campaigns.id = variants.campaign_id 
    GROUP BY campaigns.id
  `);

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    status: row.status,
    type: row.type,
    variants: row.variants,
    created_at: row.created_at
  }));
}

  
/**
 * Retrieves all active campaigns.
 *
 * @returns {Promise<Campaign[]>} An array of all active campaigns.
 */
async getActiveCampaigns(): Promise<Campaign[]> {
  const { rows } = await this.pool.query(`
    SELECT campaigns.*, array_agg(variants) as variants 
    FROM campaigns 
    LEFT JOIN variants ON campaigns.id = variants.campaign_id 
    WHERE campaigns.status = $1 
    GROUP BY campaigns.id
  `, ['running']);

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    status: row.status,
    type: row.type,
    variants: row.variants,
    created_at: row.created_at 
  }));
}
  

/**
 * Retrieves the control for a given campaign.
 *
 * @param {number} campaignId - The ID of the campaign.
 * @returns {Promise<Controls>} The control of the given campaign.
 */
async getControlForCampaign(campaignId: number): Promise<Controls> {
  const { rows } = await this.pool.query('SELECT * FROM controls WHERE campaign_id = $1', [campaignId]);
  if (rows.length > 0) {
    return {
      id: rows[0].id,
      campaignId: rows[0].campaign_id,
      name: rows[0].name,
      identifier: rows[0].identifier,
    };
  }
  throw new Error(`No control found for campaign id ${campaignId}`);
}
  
/**
 * Retrieves the variants for a given campaign.
 *
 * @param {number} campaignId - The ID of the campaign.
 * @returns {Promise<Variants[]>} An array of variants for the given campaign.
 */
async getVariantsForCampaign(campaignId : number): Promise<Variants[]> {
  const { rows } = await this.pool.query('SELECT * FROM variants WHERE campaign_id = $1', [campaignId]);
  return rows.map(row => ({
    campaignId: row.campaign_id,
    id: row.id,
    name: row.name,
    identifier: row.identifier,
  }));
}
/**
 * Retrieves the aggregate results for a given ID.
 *
 * @param {number} id - The ID for which to retrieve aggregate results.
 * @returns {Promise<Aggregates>} The aggregate results for the given ID.
 */
async getAggregateResults(id: number): Promise<Aggregates> {
  try {
    const { rows } = await this.pool.query(
      'SELECT SUM(total_clicks) AS total_clicks, SUM(total_views) AS total_views FROM aggregates WHERE id = $1',
      [id]
    );

    const { total_clicks, total_views } = rows[0];

    return {
      id: 1, // Assign the correct ID
      assignedId: 1, // Assign the correct assigned ID
      totalClicks: total_clicks || 0,
      totalViews: total_views || 0,
      ctr: 0, // Set the default value or calculate the CTR
      lastUpdated: new Date() // Set the correct last updated timestamp
    };
  } catch (error) {
    console.error(`Error retrieving aggregate results for id: ${id}`, error);
    throw new Error(`Error retrieving aggregate results for id: ${id}`);
  }
}

/**
 * Retrieves the upper confidence interval for a given campaign.
 *
 * @param {number} campaignId - The ID of the campaign.
 * @returns {Promise<number | null>} The upper confidence interval for the given campaign, or null if it doesn't exist.
 */
async getConfidenceIntervalUpper(campaignId: number): Promise<number | null> {
  try {
    const { rows } = await this.pool.query(
      'SELECT confidence_interval_upper FROM campaign_results WHERE campaign_id = $1',
      [campaignId]
    );

    if (rows.length > 0) {
      return rows[0].confidence_interval_upper;
    }
    return null;
  } catch (error) {
    console.error(`Error retrieving confidence interval upper for campaign id: ${campaignId}`, error);
    throw new Error(`Error retrieving confidence interval upper for campaign id: ${campaignId}`);
  }
}

  /**
   * Pauses/Resumes a campaign by setting its status to "paused"/"running".
   *
   * @param {number} campaignId - The ID of the campaign to pause/resume.
   * @param {string} status - The status to set the campaign to.
   */
  async resumePauseCampaign(campaignId : number, status: string): Promise<void> {
    rollbar.info(`Updating campaign to ${status}`, { campaignId });

    await this.pool.query('UPDATE campaigns SET status = $1 WHERE id = $2', [status, campaignId]);
  }


  
  destructor() {
    this.pool.end();
  }
}


