"""
This is the file containing the wrapper unctions for DB requests
Assuming the choice of db is mongoDB
"""

# input:
#       DB: the database object
#       value: the DB searching evidence, for mongoDB this is a dictionary variable
# output: the first occurrence in the database
def DB_find_one(db, value):
    return db.find_one(value)

# input:
#       DB: the database object
#       content: content to insert into DB
# output: inserted object
def DB_insert_one(db, content):
    return db.insert_one(content)

# input:
#       DB: the database object
#       value: the DB searching evidence, for mongoDB this is a dictionary variable
#       query
# output: updated object
def DB_find_one_and_update(db, value, query):
    return db.find_one_and_update(value, query)

# input:
#       DB: the database object
#       value: the DB searching evidence, for mongoDB this is a dictionary variable
# output: deleted object
def DB_delete_one(db, value):
    return db.delete_one(value)

# input:
#       DB: the database object
#       value: the DB searching evidence, for mongoDB this is a dictionary variable
#       query
# output: updated object
def DB_update_one(db, value, query):
    return db.update_one(query, value)

# input:
#       DB: the database object
#       object: the object to be inserted to the database
# output: inserted object
def DB_insert(db, object):
    return db.insert(object)

# input:
#       DB: the database object
#       value: the DB searching evidence, for mongoDB this is a dictionary variable
# output: inserted object
def DB_find(db, value):
    return db.find(value)
