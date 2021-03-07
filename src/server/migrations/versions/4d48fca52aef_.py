"""empty message

Revision ID: 4d48fca52aef
Revises: 38aa99183fce
Create Date: 2021-03-07 13:54:08.752256

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4d48fca52aef'
down_revision = '38aa99183fce'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('open_stripe_session',
    sa.Column('session_id', sa.String(length=100), nullable=False),
    sa.Column('user_id', sa.String(length=30), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('session_id'),
    sa.UniqueConstraint('session_id')
    )
    op.create_unique_constraint(None, 'user', ['stripe_customer_id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'user', type_='unique')
    op.drop_table('open_stripe_session')
    # ### end Alembic commands ###
