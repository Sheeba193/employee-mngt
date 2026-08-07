using EmployeeManagement.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace EmployeeManagement.API.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "8.0.8");

            modelBuilder.Entity("EmployeeManagement.API.Models.Department", b =>
            {
                b.Property<int>("DepartmentId")
                    .ValueGeneratedOnAdd()
                    .HasColumnType("int");

                b.Property<string>("DepartmentName")
                    .IsRequired()
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("Description")
                    .HasColumnType("nvarchar(max)");

                b.HasKey("DepartmentId");

                b.ToTable("Departments");
            });

            modelBuilder.Entity("EmployeeManagement.API.Models.Employee", b =>
            {
                b.Property<int>("EmployeeId")
                    .ValueGeneratedOnAdd()
                    .HasColumnType("int");

                b.Property<int>("DepartmentId")
                    .HasColumnType("int");

                b.Property<string>("Email")
                    .IsRequired()
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("FirstName")
                    .IsRequired()
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("Gender")
                    .HasColumnType("nvarchar(max)");

                b.Property<DateTime>("HireDate")
                    .HasColumnType("datetime2");

                b.Property<string>("LastName")
                    .IsRequired()
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("Phone")
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("Position")
                    .HasColumnType("nvarchar(max)");

                b.Property<decimal>("Salary")
                    .HasColumnType("decimal(18,2)");

                b.HasKey("EmployeeId");

                b.HasIndex("DepartmentId");

                b.ToTable("Employees");
            });

            modelBuilder.Entity("EmployeeManagement.API.Models.User", b =>
            {
                b.Property<int>("Id")
                    .ValueGeneratedOnAdd()
                    .HasColumnType("int");

                b.Property<DateTime>("CreatedAt")
                    .HasColumnType("datetime2");

                b.Property<string>("Email")
                    .IsRequired()
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("PasswordHash")
                    .IsRequired()
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("Role")
                    .IsRequired()
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("Username")
                    .IsRequired()
                    .HasColumnType("nvarchar(450)");

                b.HasKey("Id");

                b.HasIndex("Username")
                    .IsUnique();

                b.ToTable("Users");
            });

            modelBuilder.Entity("EmployeeManagement.API.Models.Employee", b =>
            {
                b.HasOne("EmployeeManagement.API.Models.Department", "Department")
                    .WithMany("Employees")
                    .HasForeignKey("DepartmentId")
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired();

                b.Navigation("Department");
            });
        }
    }
}
