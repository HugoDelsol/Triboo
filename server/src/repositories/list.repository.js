// server/src/repositories/list.repository.js
import { pool } from '../config/database.js';

export async function findAllLists(householdId) {
    const [rows] = await pool.query(
        `SELECT
            l.id,
            l.title,
            l.category_id,
            c.name AS category_name,
            c.color AS category_color,
            COUNT(li.id) AS total_items,
            SUM(CASE WHEN li.is_checked THEN 1 ELSE 0 END) AS checked_items
         FROM lists l
         LEFT JOIN categories c ON c.id = l.category_id
         LEFT JOIN list_items li ON li.list_id = l.id
         WHERE l.household_id = ?
         GROUP BY l.id`,
        [householdId]
    );
    return rows;
}

export async function findListById(id, householdId) {
    const [rows] = await pool.query(
        `SELECT l.id, l.title, l.category_id, c.name AS category_name, c.color AS category_color
     FROM lists l
     LEFT JOIN categories c ON c.id = l.category_id
     WHERE l.id = ? AND l.household_id = ?`,
        [id, householdId]
    );
    return rows[0] || null;
}

export async function insertList(householdId, createdByProfileId, title, categoryId = null) {
    const [result] = await pool.query(
        `INSERT INTO lists (household_id, category_id, created_by_profile_id, title) VALUES (?, ?, ?, ?)`,
        [householdId, categoryId, createdByProfileId, title]
    );
    return result.insertId;
}

export async function deleteList(id, householdId) {
    const [result] = await pool.query(
        `DELETE FROM lists WHERE id = ? AND household_id = ?`,
        [id, householdId]
    );
    return result.affectedRows > 0;
}

export async function findItemsByListId(listId) {
    const [rows] = await pool.query(
        `SELECT id, label, is_checked FROM list_items WHERE list_id = ?`,
        [listId]
    );
    return rows;
}

export async function insertListItem(listId, label) {
    const [result] = await pool.query(
        `INSERT INTO list_items (list_id, label, is_checked) VALUES (?, ?, false)`,
        [listId, label]
    );
    return result.insertId;
}

export async function updateListItem(itemId, listId, isChecked) {
    const [result] = await pool.query(
        `UPDATE list_items SET is_checked = ? WHERE id = ? AND list_id = ?`,
        [isChecked, itemId, listId]
    );
    return result.affectedRows > 0;
}

export async function deleteListItem(itemId, listId) {
    const [result] = await pool.query(
        `DELETE FROM list_items WHERE id = ? AND list_id = ?`,
        [itemId, listId]
    );
    return result.affectedRows > 0;
}