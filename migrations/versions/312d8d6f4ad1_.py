"""empty message

Revision ID: 312d8d6f4ad1
Revises: d3a451dec3b0
Create Date: 2018-06-11 12:50:39.353132

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '312d8d6f4ad1'
down_revision = 'd3a451dec3b0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('activities', sa.Column('user_id', sa.String(length=30), nullable=False))
    op.create_unique_constraint(None, 'activities', ['id'])
    op.create_foreign_key(None, 'activities', 'user', ['user_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'activities', type_='foreignkey')
    op.drop_constraint(None, 'activities', type_='unique')
    op.drop_column('activities', 'user_id')
    # ### end Alembic commands ###