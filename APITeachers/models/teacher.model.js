
const { executeQuery, executeQueryOne } = require('../helpers/utils');

//sqlTeachersData para un profesor y luego consultar su rating avg
const sqlTeachersData = 'select u.id as user_id, u.name, u.surname, u.email, u.password, u.creation_date, u.leaving_date, u.role_id, t.id as teacher_id, ' +
                        't.phone, t.branch_id, b.title as branch_title, b.description as branch_description, t.price_hour, t.experience, ' +
                        't.validated, t.location_id, l.address, l.latitude, l.longitude, l.city_id, c.name as city, c.province_id, p.name as province, t.avatar,t.subjects '+
                        'from users u, teachers t, branches b, locations l, cities c, provinces p ' +
                        'where (u.id=t.user_id) and (t.branch_id=b.id) and (t.location_id=l.id) and (l.city_id=c.id) and (c.province_id=p.id) and (u.role_id=2)';

//sqlAllTeachersData para todos                        
const sqlAllTeachersData = 'select u.id as user_id, u.name, u.surname, u.email, u.password, u.creation_date, u.role_id, t.id as teacher_id, ' +
                        't.phone, t.branch_id, b.title as branch_title, b.description as branch_description, t.price_hour, t.experience, ' +
                        't.validated, t.location_id, l.address, l.latitude, l.longitude, l.city_id, c.name as city, c.province_id, p.name as province, t.avatar, t.subjects, CAST(AVG(r.rating) AS DECIMAL(10,2)) as avg_rating ' +
                        'from users u, teachers t, branches b, locations l, cities c, provinces p, ratings r ' +                                                            
                        'where (u.id=t.user_id) and (t.branch_id=b.id) and (t.location_id=l.id) and (l.city_id=c.id) and (c.province_id=p.id) and (u.role_id=2) and (t.id=r.teacher_id) ' +
                        'group by teacher_id ' +
                        'UNION ' +
                        'select u.id as user_id, u.name, u.surname, u.email, u.password, u.creation_date, u.role_id, t.id as teacher_id, ' +
                        't.phone, t.branch_id, b.title as branch_title, b.description as branch_description, t.price_hour, t.experience, ' +
                        't.validated, t.location_id, l.address, l.latitude, l.longitude, l.city_id, c.name as city, c.province_id, p.name as province, t.avatar,t.subjects, -1 as avg_rating ' +
                        'from users u, teachers t, branches b, locations l, cities c, provinces p ' +
                        'where (u.id=t.user_id) and (t.branch_id=b.id) and (t.location_id=l.id) and (l.city_id=c.id) and (c.province_id=p.id) and (u.role_id=2) ' +
                        'and not exists (select distinct teacher_id from ratings where ratings.teacher_id = t.id) ';


/**
 * Get the teacher with the given id.
 * @param teacherid - The id of the teacher you want to get.
 * @returns An object with the teacher's information.
 */
/**TODO: 
 * Consultar a Laura por esta query, si es para obtener un profesor en base a su user_id que no es el id teacher
 * Si es así para cambiar por getTeacherByUserId  u.id = ?
*/
const getTeacherByUserId = (teacherid) => {
    return executeQueryOne(
        'SELECT * FROM teachers AS t '+
        'INNER JOIN users AS u ON t.user_id = u.id '+
        'INNER JOIN roles AS r ON r.id = u.role_id '+
        'WHERE r.title = "teacher" AND u.id = ?',
        [teacherid]
    );
}; 


const getAllTeachers = () => {    
    return executeQuery(sqlAllTeachersData + ' order by teacher_id');
}

/**TODO: Devolver los profesores paginados con filtros*/
const getTeachersByPage = (page, limit) => {   
   return executeQuery(sqlAllTeachersData + ' order by teacher_id' + ' limit ? offset ?', [limit, (page - 1) * limit]);
}

const getAllTeachersByFilters = (filter) => {    
    return executeQuery(sqlAllTeachersData + filter);
}

const getTeacherById = (teacherId) => {
    return executeQueryOne(sqlTeachersData + ' and (t.id=?)', [teacherId]);
}

const getTeacherByEmail = (email) => {
    return executeQueryOne(sqlTeachersData + ' and (u.email=?)', [email]);
}

const getBranchById = (branchId) => {
    return executeQueryOne('select * from branches where id=?', [branchId]);
}

const createTeacher = ({ phone, branch_id, price_hour, experience, validated, location_id, avatar, user_id ,subjects }) => {
    return executeQuery('insert into teachers (phone, branch_id, price_hour, experience, validated, location_id, avatar, user_id ,subjects) '+
                        'values  (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                       [phone, branch_id, price_hour, experience, validated, location_id, avatar, user_id ,subjects]);
}

const invalidateTeacher = (teacherId) => {    
    return executeQuery('update teachers set validated = 0 where id = ?', [teacherId]);
}

const updateTeacher = (teacherId, { phone, branch_id, price_hour, experience, validated, location_id, avatar, user_id ,subjects }) => {
    return executeQuery('update teachers set phone = ?, branch_id = ?, price_hour = ?, experience =?, validated = ?, location_id = ?, avatar =?, user_id = ?, subjects = ? where id = ?', 
                       [phone, branch_id, price_hour, experience, validated, location_id, avatar, user_id ,subjects, teacherId]);
}

module.exports = {
    getAllTeachers, getTeachersByPage, getTeacherByUserId, getTeacherById, getAllTeachersByFilters, getTeacherByEmail, getBranchById, createTeacher, invalidateTeacher, updateTeacher
}
