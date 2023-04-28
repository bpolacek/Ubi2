from random import choice as rc
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app import app
from models import db, RelationshipType

with app.app_context():
    
    print("Deleting data...")
    RelationshipType.query.delete()

    print("Creating relationship types...")
    rt1=RelationshipType(type="Family")
    rt2=RelationshipType(type="Close Friends")
    rt3=RelationshipType(type="Friends")
    rt4=RelationshipType(type="Acquaintences")
    rt5=RelationshipType(type="Work Friends")
    rt6=RelationshipType(type="Former Colleagues")    
    relationshiptypes = [rt1, rt2, rt3,rt4,rt5,rt6]

    db.session.add_all(relationshiptypes)
    db.session.commit()

    print("Seeding done!")
    print(rt1.type)