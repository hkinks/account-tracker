"""sender and receiver fields

Revision ID: e247ac10f43f
Revises: dfbbaed7a58e
Create Date: 2025-02-24 15:53:28.488850

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e247ac10f43f'
down_revision: Union[str, None] = 'dfbbaed7a58e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('bank_transactions', sa.Column('sender', sa.String(), nullable=False))
    op.add_column('bank_transactions', sa.Column('receiver', sa.String(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('bank_transactions', 'receiver')
    op.drop_column('bank_transactions', 'sender')
    # ### end Alembic commands ###
