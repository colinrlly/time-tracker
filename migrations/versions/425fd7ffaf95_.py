"""empty message

Revision ID: 425fd7ffaf95
Revises: 23a90db681ea
Create Date: 2018-06-11 09:48:29.153358

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '425fd7ffaf95'
down_revision = '23a90db681ea'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.String(length=30), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=True),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('picture', sa.String(length=2000), nullable=True),
    sa.Column('given_name', sa.String(length=255), nullable=True),
    sa.Column('family_name', sa.String(length=255), nullable=True),
    sa.Column('locale', sa.String(length=10), nullable=True),
    sa.Column('current_activity', sa.String(length=255), nullable=True),
    sa.Column('started_at', sa.DateTime(), nullable=True),
    sa.Column('stopped_at', sa.DateTime(), nullable=True),
    sa.Column('refresh_token', sa.String(length=255), nullable=True),
    sa.Column('credentials', sa.String(length=7000), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user')
    # ### end Alembic commands ###