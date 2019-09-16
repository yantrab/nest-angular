export const getIds = 'select securityId, [type] from AlertsNewBondNewMeeting where sendDate is null';
export const userToSendNewMeeting = 'select email from tSecUsers where NewMeetingAlert = 1';
export const userToSendNewBonds = 'select email from tSecUsers where NewBondsAlert = 1';

export const newMeetingQueries = (date: Date, id: number) => {
    lastPrice: `
    select top 1 report_date from dbSecurity.dbo.PriceHistory
    where security_id = ${id} and report_date < ${date} 
    order by report_date desc
    `;
    data: `
    SELECT 
    [GroupBy1].[K1] AS [SecurityID], 
    CASE WHEN ([Extent3].[name_hebrew] IS NULL) THEN CASE WHEN ([Extent2].[ShareholderName] IS NULL) 
                                                THEN [GroupBy1].[K4] ELSE [Extent2].[ShareholderName] 
         END ELSE [Extent3].[name_hebrew] END AS [C1], 
    [GroupBy1].[A1] AS [C2], 
    [GroupBy1].[K3] AS [ShareholderID]
    FROM    (SELECT 
        [Extent1].[SecurityID] AS [K1], 
        [Extent1].[ReportDate] AS [K2], 
        [Extent1].[ShareholderID] AS [K3], 
        [Extent1].[ShareholderName] AS [K4], 
        SUM([Extent1].[Quantity]) AS [A1]
        FROM [dbo].[ShareholdersMeetingsHistory] AS [Extent1]
        WHERE ([Extent1].[ReportDate] = @p__linq__0) AND ( CAST( [Extent1].[SecurityID] AS bigint) = @p__linq__1)
        GROUP BY [Extent1].[SecurityID], [Extent1].[ReportDate], [Extent1].[ShareholderID], [Extent1].[ShareholderName] ) AS [GroupBy1]
    LEFT OUTER JOIN [dbo].[ShareholdersList] AS [Extent2] ON [GroupBy1].[K3] = [Extent2].[ShareholderID]
    LEFT OUTER JOIN [dbo].[ManagementList] AS [Extent3] ON [Extent2].[Management_id] = [Extent3].[management_id]
    `;
};
