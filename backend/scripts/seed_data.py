"""
Seed data script for TransitOps360.
Creates initial roles and admin user.
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, Role
from sqlalchemy.exc import IntegrityError


def seed_roles(db):
    """Seed initial roles."""
    roles_data = [
        {
            "name": "Fleet_Manager",
            "permissions": [
                "vehicles:read",
                "vehicles:write",
                "vehicles:delete",
                "drivers:read",
                "drivers:write",
                "drivers:delete",
                "trips:read",
                "trips:write",
                "maintenance:read",
                "maintenance:write",
                "analytics:read",
                "compliance:read",
            ]
        },
        {
            "name": "Dispatcher",
            "permissions": [
                "trips:read",
                "trips:write",
                "trips:dispatch",
                "vehicles:read",
                "drivers:read",
            ]
        },
        {
            "name": "Safety_Officer",
            "permissions": [
                "drivers:read",
                "drivers:write",
                "compliance:read",
                "compliance:write",
                "vehicles:read",
            ]
        },
        {
            "name": "Financial_Analyst",
            "permissions": [
                "analytics:read",
                "reports:read",
                "reports:export",
                "costs:read",
                "vehicles:read",
                "trips:read",
            ]
        }
    ]
    
    created_roles = {}
    for role_data in roles_data:
        # Check if role already exists
        existing_role = db.query(Role).filter(Role.name == role_data["name"]).first()
        if existing_role:
            print(f"Role '{role_data['name']}' already exists")
            created_roles[role_data["name"]] = existing_role
            continue
        
        role = Role(
            name=role_data["name"],
            permissions=role_data["permissions"]
        )
        db.add(role)
        created_roles[role_data["name"]] = role
        print(f"Created role: {role_data['name']}")
    
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        print("Error creating roles (may already exist)")
    
    return created_roles


def seed_admin_user(db, roles):
    """Seed admin user."""
    # Check if admin user already exists
    existing_user = db.query(User).filter(User.username == "admin").first()
    if existing_user:
        print("Admin user already exists")
        return existing_user
    
    # Get Fleet_Manager role
    fleet_manager_role = roles.get("Fleet_Manager")
    if not fleet_manager_role:
        fleet_manager_role = db.query(Role).filter(Role.name == "Fleet_Manager").first()
    
    if not fleet_manager_role:
        print("Error: Fleet_Manager role not found")
        return None
    
    # Create admin user
    admin_user = User(
        username="admin",
        email="admin@transit.com",
        password_hash=get_password_hash("admin123"),
        role_id=fleet_manager_role.id,
        is_active=True
    )
    
    db.add(admin_user)
    
    try:
        db.commit()
        print(f"Created admin user: username='admin', password='admin123', email='admin@transit.com'")
        return admin_user
    except IntegrityError:
        db.rollback()
        print("Error creating admin user (may already exist)")
        return None


def main():
    """Main seed function."""
    print("Starting database seeding...")
    
    db = SessionLocal()
    
    try:
        # Seed roles
        print("\n1. Seeding roles...")
        roles = seed_roles(db)
        
        # Seed admin user
        print("\n2. Seeding admin user...")
        seed_admin_user(db, roles)
        
        print("\n✅ Database seeding completed successfully!")
        print("\nDemo credentials:")
        print("  Username: admin")
        print("  Password: admin123")
        print("  Email: admin@transit.com")
        print("  Role: Fleet_Manager (full access)")
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
