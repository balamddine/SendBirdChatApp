import React from "react";
import { Icon, Table, Pagination } from 'semantic-ui-react'
class TableGrid extends React.Component<any, any> {

    render() {
        const { columns, rows, children, maxRowCount,pageSize,showActionButtons }: any = this.props;
        const colspan = columns.length + (children ? 1 : 0);
        let paginationPageCount: any = maxRowCount > 0 ? maxRowCount / parseInt(pageSize) : 0;
        paginationPageCount = parseInt(paginationPageCount) + 1

        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        {
                            columns.map((col: any) => {
                                const showOnGrid = col.showOnGrid;
                                return (
                                    <Table.HeaderCell
                                        className={!showOnGrid ? "hide" : ""}
                                        key={col.key}
                                    >
                                        {col.name}
                                    </Table.HeaderCell>
                                )
                            })
                        }
                        {
                            children && (
                                <Table.HeaderCell className="tableAction">&nbsp;</Table.HeaderCell>
                            )
                        }
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        (rows && rows.length > 0) ? (
                            rows.map((elem: any, index: any) => {
                                const even = index % 2 == 0
                                return (
                                    <Table.Row
                                        key={`${index}`}
                                        active={even}
                                    >
                                        {
                                            columns.map((col: any, index: any) => {
                                                const showOnGrid = col.showOnGrid
                                                return (
                                                    <Table.Cell
                                                        className={!showOnGrid ? "hide" : ""}
                                                        key={`${col.key}-${index}`}
                                                    >
                                                        {elem[col.key]}
                                                    </Table.Cell>
                                                )
                                            })

                                        }
                                        {
                                            showActionButtons && (
                                                <Table.Cell
                                                    key={"Table_Action"}
                                                    className="tableAction"                                                                                                       
                                                >
                                                    {
                                                        this.props.actionButtons(elem)
                                                    }
                                                </Table.Cell>
                                            )
                                        }

                                    </Table.Row>
                                )
                            })
                        ) :
                            <Table.Row>
                                <Table.Cell colSpan={colspan}>No data available.</Table.Cell>
                            </Table.Row>
                    }
                </Table.Body>
                {
                    paginationPageCount > 1 && (
                        <Table.Footer>
                            <Table.Row textAlign="right">
                                <Table.HeaderCell colSpan={colspan} >
                                    <Pagination
                                        ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                        firstItem={{ content: <Icon name='angle double left' />, icon: true, title: "First page" }}
                                        lastItem={{ content: <Icon name='angle double right' />, icon: true, title: "Last page" }}
                                        prevItem={{ content: <Icon name='angle left' />, icon: true, title: "Previous page" }}
                                        nextItem={{ content: <Icon name='angle right' />, icon: true, title: "Next page" }}
                                        defaultActivePage={5}
                                        totalPages={paginationPageCount}
                                        onPageChange={(e, { activePage }) => { this.props.pageClick(activePage) }}
                                    />
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    )
                }

            </Table>
        )
    }
}
export default TableGrid