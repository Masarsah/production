import db from "../database/config.js";


export const createEnrollment= async(value)=>{
    return db.oneOrNone('INSERT INTO enrollments (user_id ,class_id ,role_in_class) VALUES ($1,$2 ,$3) RETURNING *  ',
        [value.user_id, value.class_id , value.role_in_class])
}
export const createclsses= async(value)=>{
    return db.oneOrNone('INSERT ')
}
export const getEnrollments= async()=>{
    return db.any('SELECT * FROM enrollments')
}
export const getEnrollment= async(user_id ,class_id)=>{
    return db.oneOrNone('SELECT * FROM enrollments WHERE user_id=$1 AND class_id=$2',
        [user_id ,class_id])

}
export const updateEnrollment= async(user_id ,class_id ,value)=>{
    return db.oneOrNone('UPDATE enrollments SET role_in_class=$1 WHERE user_id=$2 AND class_id=$3 RETURNING *',
        [value.role_in_class ,user_id ,class_id])
}
export const deleteEnrollment= async(user_id ,class_id)=>{
    return db.result('DELETE FROM enrollments WHERE user_id=$1 AND class_id=$2',
        [user_id ,class_id] )
}
