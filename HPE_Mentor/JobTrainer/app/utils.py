import json
def technology_toJSON(results):
    res ={}
    c = 0
    keys = ("technology_id","created_at", "updated_at","deleted_at","is_active","is_deleted","technology_name", "created_by")
    for item in results:
        l = list(item)
        if(item[1] != None):
            l[1] = item[1].isoformat()
        if(item[2] != None):
            l[2] = item[2].isoformat()
        if(item[3] != None):
            l[3] = item[3].isoformat()
        item = tuple(l)
        mydict  = dict(zip(keys, item))
        res[c] = mydict
        c=c+1
    return res

def tutorial_toJSON(results):
    res ={}
    c=0
    keys = ("technology_id","created_at", "updated_at","deleted_at","is_active","is_deleted","topic_id", "topic_name", "links", "created_by")
    for item in results:
        l = list(item)
        if(item[1] != None):
            l[1] = item[1].isoformat()
        if(item[2] != None):
            l[2] = item[2].isoformat()
        if(item[3] != None):
            l[3] = item[3].isoformat()
        item = tuple(l)
        mydict  = dict(zip(keys, item))
        res[c] = mydict
        c = c+1
    return res


def quiz_toJSON(results):
    res ={}
    c=0
    keys = ("technology_id","created_at", "updated_at","deleted_at","is_active","is_deleted","quiz_id","quiz_name","created_by")
    for item in results:
        l = list(item)
        if(item[1] != None):
            l[1] = item[1].isoformat()
        if(item[2] != None):
            l[2] = item[2].isoformat()
        if(item[3] != None):
            l[3] = item[3].isoformat()
        item = tuple(l)
        mydict  = dict(zip(keys, item))
        res[c] = mydict
        c = c+1
    return res

def qquestion_toJSON(results):
    res ={}
    c=0
    keys = ("quiz_id", "question_id", "question", "options", "correct_option")
    for item in results:
        mydict  = dict(zip(keys, item))
        res[c] = mydict
        c = c+1
    return res

def quizcard_toJSON(results):
    res ={}
    c=0
    keys = ("technology_id","quiz_name","quiz_id","is_active","created_by")
    for item in results:
        mydict  = dict(zip(keys, item))
        res[c] = mydict
        c = c+1
    return res

def problem_toJSON(results):
    res ={}
    c=0
    keys = ("technology_id","created_at", "updated_at","deleted_at","is_deleted","is_active","assessment_id", "assessment_name", "created_by")
    for item in results:
        l = list(item)
        if(item[1] != None):
            l[1] = item[1].isoformat()
        if(item[2] != None):
            l[2] = item[2].isoformat()
        if(item[3] != None):
            l[3] = item[3].isoformat()
        item = tuple(l)
        mydict  = dict(zip(keys, item))
        res[c] = mydict
        c = c+1
    return res


def user_toJSON(results):
    res ={}
    c=0
    keys = ("user_id","role","created_at", "updated_at","deleted_at","is_active","is_deleted", "first_name", "last_name")
    for item in results:
        l = list(item)
        if(item[4] != None):
            l[4] = item[1].isoformat()
        if(item[2] != None):
            l[2] = item[2].isoformat()
        if(item[3] != None):
            l[3] = item[3].isoformat()
        item = tuple(l)
        mydict  = dict(zip(keys, item))
        res[c] = mydict
        c = c+1
    return res

def user_toJSON(results):
    res ={}
    c=0
    keys = ("user_id","role","created_at", "updated_at","deleted_at","is_active","is_deleted", "first_name", "last_name")
    for item in results:
        l = list(item)
        if(item[4] != None):
            l[4] = item[1].isoformat()
        if(item[2] != None):
            l[2] = item[2].isoformat()
        if(item[3] != None):
            l[3] = item[3].isoformat()
        item = tuple(l)
        mydict  = dict(zip(keys, item))
        res[c] = mydict
        c = c+1
    return res



def mycoursestoJSON(results, technames):
    res = {}
    c=0
    keys=("enrollment_id", "user_id", "technology_id", "enrollment_date", "progress","grade", "technology_name")
    for item in results:
        l = list(item)
        if(item[3] != None):
            l[3] = item[3].isoformat()
        l.append(technames[c])
        item  = tuple(l)
        mydict = dict(zip(keys, item))
        res[c] = mydict
        c=c+1
    return(res)

def myquiztoJSON(results):
    res = {}
    c=0
    keys = ("technology_id", "is_active", "quiz_id", "quiz_name")
    for item in results:
        res[c] = dict(zip(keys, item))
        c=c+1
    return res

def myassessmenttoJSON(results):
    res = {}
    c=0
    keys = ("technology_id", "is_active", "assessment_id", "assessment_name")
    for item in results:
        res[c] = dict(zip(keys, item))
        c=c+1
    return res

def quiz_questions(results):
    res = {} 
    c=0
    keys= ("question_id", "question","options")
    for item in results:
        res[c] = dict(zip(keys, item))
        c=c+1
    return res

def quiz_solutions(results):
    res = {} 
    c=0
    keys= ("question_id", "question","options","correct_option")
    for item in results:
        res[c] = dict(zip(keys, item))
        c=c+1
    return res


def quiz_scoretoJSON(results):
    res = {} 
    c=0
    keys= ("score", "max_score","wrong_ans")
    for item in results:
        res[c] = dict(zip(keys, item))
        c=c+1
    return res

def assessment_attempttoJSON(results):
    res ={}
    c=0
    keys = ("attempt_id","attempt_date", "submitted_at","submitted","viewed_solution","user_id","assessment_id")
    for item in results:
        l = list(item)
        if(item[1] != None):
            l[1] = item[1].isoformat()
        if(item[2] != None):
            l[2] = item[2].isoformat()
        item = tuple(l)
        mydict  = dict(zip(keys, item))
        res[c] = mydict
        c = c+1
    return res